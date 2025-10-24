package mercuryclientgo

import (
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	schemas "github.com/sprucelabsai-community/spruce-core-schemas/v41/pkg/schemas/spruce/v2020_07_22"
	ioClient "github.com/zishang520/socket.io/clients/socket/v3"
	serverSocket "github.com/zishang520/socket.io/servers/socket/v3"
	socketTypes "github.com/zishang520/socket.io/v3/pkg/types"
)

type (
	Client struct {
		socket Socket
	}

	Socket interface {
		Emit(event string, args ...any) error
		On(event string, listeners ...socketTypes.EventListener) error
		Off(event string, listener socketTypes.EventListener) bool
		Connected() bool
		Disconnect() Socket
	}

	ConnectFunc func(string, ioClient.OptionsInterface) (Socket, error)

	SocketIoClient struct {
		socket *ioClient.Socket
	}

	emitResponse struct {
		resp []ResponsePayload
		err  error
	}
)

func (c *Client) Connect(url string, opts MercuryClientOptions) error {
	socketOptions := ioClient.DefaultOptions()
	if opts.TimeoutSec > 0 {
		socketOptions.SetTimeout(time.Duration(opts.TimeoutSec * int(time.Second)))
	}

	socketOptions.SetReconnection(opts.ShouldRetryConnect)
	socket, err := GetConnect()(url, socketOptions)

	if err != nil {
		return err
	}

	c.socket = socket

	done := make(chan error, 1)
	var once sync.Once

	finish := func(err error) {
		once.Do(func() {
			done <- err
		})
	}

	socket.On("connect", func(...any) {
		println("Connected to server")
		finish(nil)
	})

	socket.On("disconnect", func(args ...any) {
		fmt.Println(append([]any{"Disconnected:"}, args...)...)
	})

	socket.On("error", func(args ...any) {
		fmt.Println(append([]any{"Error:"}, args...)...)
	})

	socket.On("reconnect_error", func(args ...any) {
		fmt.Println(append([]any{"Reconnect Error:"}, args...)...)
	})

	socket.On("connect_error", func(args ...any) {
		fmt.Println(append([]any{"Connection Error:"}, args...)...)

		var connErr error
		if len(args) > 0 {
			if errVal, ok := args[0].(error); ok && errVal != nil {
				connErr = errVal
			} else {
				connErr = fmt.Errorf("socket connect error: %v", args[0])
			}
		} else {
			connErr = fmt.Errorf("socket connect error")
		}

		finish(connErr)
	})

	if socket.Connected() {
		finish(nil)
	}

	waitErr := <-done
	if waitErr != nil {
		if c.socket != nil {
			c.socket.Disconnect()
			c.socket = nil
		}
		return waitErr
	}

	return nil
}

func (c *Client) Disconnect() {
	if c.socket != nil {
		c.socket.Disconnect()
	}
}

func (c *Client) IsConnected() bool {
	return c.socket.Connected()
}

func (c *Client) Emit(event string, args ...TargetAndPayload) ([]ResponsePayload, error) {

	done := make(chan emitResponse, 1)

	targetAndPayload := TargetAndPayload{}

	if len(args) > 0 {
		targetAndPayload = args[0]
	}

	mappedEventName := toSocketName(event)

	c.socket.Emit(mappedEventName, targetAndPayload, func(response []any, err error) {
		if len(response) > 0 {
			data, err := json.Marshal(response[0])
			if err != nil {
				done <- emitResponse{nil, err}
				return
			}

			var aggregateResponse MercuryAggregateResponse
			if err := json.Unmarshal(data, &aggregateResponse); err != nil {
				done <- emitResponse{nil, err}
				return
			}

			singleResponses := aggregateResponse.Responses
			var resp []ResponsePayload
			for _, single := range singleResponses {
				resp = append(resp, single.Payload)
				if len(single.Errors) > 0 {
					errMsg := single.Errors[0]
					if errMsg != "" {
						err = fmt.Errorf("error from emit: %v", errMsg)
						break
					}
				}
			}

			if resp == nil {
				resp = []ResponsePayload{}
			}

			done <- emitResponse{resp, err}
			return
		}

		fmt.Println("In callback with response:", response)
	})

	emitResponse := <-done

	return emitResponse.resp, emitResponse.err
}

func toSocketName(event string) string {
	// replace dots (.) with double underscores (__)
	return strings.ReplaceAll(event, ".", "__")
}

func (c *Client) Authenticate(opts AuthenticatePayload) (*AuthenticatResponse, error) {
	results, err := c.Emit("authenticate::v2020_12_25", TargetAndPayload{
		Payload: map[string]any{
			"skillId": opts.SkillId,
			"apiKey":  opts.ApiKey,
			"token":   opts.Token,
		},
	})

	if err != nil {
		return nil, err
	}

	fmt.Println("Authenticate response:", results)

	auth, ok := results[0]["auth"].(map[string]any)
	if !ok || len(auth) == 0 {
		return nil, fmt.Errorf("auth field not found in response")
	}

	authResponse := &AuthenticatResponse{}

	if skillValues, ok := auth["skill"].(map[string]any); ok {
		skill, err := schemas.MakeSkill(skillValues)
		if err != nil {
			return nil, fmt.Errorf("failed to parse skill: %w", err)
		}
		authResponse.Skill = skill
	}

	if personValues, ok := auth["person"].(map[string]any); ok {
		person, err := schemas.MakePerson(personValues)
		if err != nil {
			return nil, fmt.Errorf("failed to parse person: %w", err)
		}
		authResponse.Person = person
	}

	return authResponse, nil
}

func (c *Client) On(event string, listener MercuryListener) {
	results, err := c.Emit("register-listeners::v2020_12_25", TargetAndPayload{
		Payload: map[string]any{
			"events": []map[string]string{
				{
					"eventName": event,
				},
			},
		},
	})

	fmt.Println("Register listeners response:", results, err)

	handler := func(args ...any) {
		fmt.Println("Event received:", event, args, listener)

		var ack serverSocket.Ack
		argLen := len(args)
		if argLen > 0 {
			if maybeAck, ok := args[argLen-1].(serverSocket.Ack); ok && maybeAck != nil {
				ack = maybeAck
				args = args[:argLen-1]
				argLen--
			}
		}

		var handlerErr error
		var targetAndPayload TargetAndPayload

		if argLen > 0 {
			if err := mapToStruct(args[0], &targetAndPayload); err != nil {
				handlerErr = fmt.Errorf("failed to parse target and payload: %w", err)
			}
		}

		fmt.Println("Parsed targetAndPayload:", targetAndPayload)

		var response any

		if listener != nil && handlerErr == nil {
			defer func() {
				if recoverErr := recover(); recoverErr != nil {
					handlerErr = fmt.Errorf("listener panic: %v", recoverErr)
				}
			}()
			response = listener(targetAndPayload)

			if errVal, ok := response.(error); ok && errVal != nil {
				handlerErr = errVal
				response = nil
			}
		}

		if ack == nil {
			return
		}

		if handlerErr != nil {
			errorAck := map[string]any{
				"errors": []any{
					map[string]any{
						"code":            "LISTENER_ERROR",
						"friendlyMessage": handlerErr.Error(),
						"fqen":            event,
						"originalError":   handlerErr.Error(),
					},
				},
			}
			ack([]any{errorAck}, nil)
			return
		}

		if response != nil {
			ack([]any{response}, nil)
			return
		}

		ack(nil, nil)
	}

	c.socket.On(event, handler)

	if socketEvent := toSocketName(event); socketEvent != event {
		c.socket.On(socketEvent, handler)
	}
}

func (c *Client) Off(event string, listeners ...MercuryListener) {
	results, err := c.Emit("unregister-listeners::v2020_12_25", TargetAndPayload{
		Payload: map[string]any{
			"fullyQualifiedEventNames": []string{event},
		},
	})

	fmt.Println("Unregister listeners response:", results, err)
	c.socket.Off(event, nil)
}

func mapToStruct(data any, out any) error {
	bytes, err := json.Marshal(data)
	if err != nil {
		return err
	}
	return json.Unmarshal(bytes, out)
}

var (
	connectMu sync.RWMutex
	connectFn ConnectFunc = defaultConnect
)

func SetConnect(fn ConnectFunc) {
	connectMu.Lock()
	defer connectMu.Unlock()
	if fn == nil {
		connectFn = defaultConnect
		return
	}
	connectFn = fn
}

func GetConnect() ConnectFunc {
	connectMu.RLock()
	defer connectMu.RUnlock()
	return connectFn
}

func defaultConnect(url string, opts ioClient.OptionsInterface) (Socket, error) {
	socket, err := ioClient.Connect(url, opts)
	if err != nil {
		return nil, err
	}
	return newSocketIoClient(socket), nil
}

func newSocketIoClient(socket *ioClient.Socket) Socket {
	if socket == nil {
		return nil
	}
	return &SocketIoClient{socket: socket}
}

func (s *SocketIoClient) Emit(event string, args ...any) error {
	return s.socket.Emit(event, args...)
}

func (s *SocketIoClient) On(event string, listeners ...socketTypes.EventListener) error {
	return s.socket.On(socketTypes.EventName(event), listeners...)
}

func (s *SocketIoClient) Connected() bool {
	return s.socket.Connected()
}

func (s *SocketIoClient) Connect() {
	s.socket.Connect()
}

func (s *SocketIoClient) Disconnect() Socket {
	s.socket.Disconnect()
	return s
}

func (s *SocketIoClient) Off(event string, listener socketTypes.EventListener) bool {
	s.socket.RemoveAllListeners(socketTypes.EventName(event))
	return true
}

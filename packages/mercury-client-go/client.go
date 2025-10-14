package mercuryclientgo

import (
	"fmt"
	"sync"

	ioClient "github.com/zishang520/socket.io/clients/socket/v3"
	socketTypes "github.com/zishang520/socket.io/v3/pkg/types"
)

type Client struct {
	socket Socket
}

func (c *Client) Connect(url string) error {
	socket, err := GetConnect()(url, nil)
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

func (c *Client) Emit(event string, args ...any) (Response, error) {
	return Response{}, nil
}

type Socket interface {
	Emit(event string, args ...any) error
	On(event string, listeners ...socketTypes.EventListener) error
	Connected() bool
	Disconnect() Socket
}

type ConnectFunc func(string, ioClient.OptionsInterface) (Socket, error)

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

type SocketIoClient struct {
	socket *ioClient.Socket
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

func (s *SocketIoClient) Disconnect() Socket {
	s.socket.Disconnect()
	return s
}

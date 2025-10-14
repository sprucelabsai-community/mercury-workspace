package mercuryclientgo

import (
	"fmt"
	"sync"
	"sync/atomic"

	ioClient "github.com/zishang520/socket.io/clients/socket/v3"
	socketTypes "github.com/zishang520/socket.io/v3/pkg/types"
)

type Client struct {
	socket      Socket
	isConnected atomic.Bool
}

func (c *Client) Connect(url string) error {
	c.isConnected.Store(false)

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
		c.isConnected.Store(true)
		finish(nil)
	})

	socket.On("disconnect", func(...any) {
		println("Disconnected from server")
		c.isConnected.Store(false)
	})

	socket.On("error", func(args ...any) {
		fmt.Println(append([]any{"Error:"}, args...)...)
	})

	socket.On("connect_error", func(args ...any) {
		fmt.Println(append([]any{"Connection Error:"}, args...)...)
		c.isConnected.Store(false)

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
		c.isConnected.Store(true)
		finish(nil)
	}

	waitErr := <-done
	if waitErr != nil {
		return waitErr
	}

	return nil
}

func (c *Client) Disconnect() {
	if c.socket != nil {
		c.socket.Disconnect()
		c.socket = nil
	}
	c.isConnected.Store(false)
}

func (c *Client) IsConnected() bool {
	return c.isConnected.Load()
}

type ConnectFunc func(string, ioClient.OptionsInterface) (Socket, error)

var (
	connectMu sync.RWMutex
	connectFn ConnectFunc = ioClient.Connect
)

func SetConnect(fn ConnectFunc) {
	connectMu.Lock()
	defer connectMu.Unlock()
	if fn == nil {
		connectFn = ioClient.Connect
		return
	}
	connectFn = fn
}

func GetConnect() ConnectFunc {
	connectMu.RLock()
	defer connectMu.RUnlock()
	return connectFn
}

type Socket interface {
	Emit(event string, args ...any) error
	On(event socketTypes.EventName, listeners ...socketTypes.EventListener) error
	Connected() bool
	Disconnect() Socket
}

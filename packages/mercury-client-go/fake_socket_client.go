package mercuryclientgo

import (
	ioClient "github.com/zishang520/socket.io/clients/socket/v3"
	socketTypes "github.com/zishang520/socket.io/v3/pkg/types"
)

type FakeSocketClient struct {
	host         string
	opts         ioClient.OptionsInterface
	is_connected bool
}

func FakeSocketConnect(host string, opts ioClient.OptionsInterface) (Socket, error) {
	client := &FakeSocketClient{
		host: host,
		opts: opts,
	}

	client.is_connected = true

	return client, nil
}

func (s *FakeSocketClient) Emit(event string, args ...any) error {
	return nil
}

func (s *FakeSocketClient) On(event string, listeners ...socketTypes.EventListener) error {
	return nil
}

func (s *FakeSocketClient) Connected() bool {
	return s.is_connected
}

func (s *FakeSocketClient) Disconnect() Socket {
	return s
}

func (s *FakeSocketClient) SetConnected(connected bool) {
	s.is_connected = connected
}

func (s *FakeSocketClient) GetOptions() ioClient.OptionsInterface {
	return s.opts
}

func (s *FakeSocketClient) GetHost() string {
	return s.host
}

func (s *FakeSocketClient) Off(event string, listener socketTypes.EventListener) bool {
	return false
}

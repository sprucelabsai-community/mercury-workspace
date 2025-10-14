package mercuryclientgo

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func beforeEach(t *testing.T) {
	t.Helper()
	SetConnect(nil)
}

func TestFactory(t *testing.T) {

	t.Run("can get back client", func(t *testing.T) {
		beforeEach(t)
		factory := Factory{}
		assert.NotNil(t, factory, "factory should not be nil")
	})

	t.Run("returns error with bad url 1", func(t *testing.T) {
		beforeEach(t)
		_, err := MakeMercuryClient("http://bad-url")
		assert.Error(t, err, "Bad url should have returned an error")
	})

	t.Run("returns error with bad url 2", func(t *testing.T) {
		beforeEach(t)
		_, err := MakeMercuryClient("http://another-bad-url")
		assert.Error(t, err, "Bad url should have returned an error")
	})

	t.Run("can connect/disconnect client", func(t *testing.T) {
		beforeEach(t)
		client, err := MakeMercuryClient()
		assert.NoError(t, err, "Factory.Client should not return an error")
		assert.True(t, client.IsConnected(), "Client should be connected on construction")
		client.Disconnect()
		assert.False(t, client.IsConnected(), "Client should be disconnected after disconnect")
	})

	t.Run("IsConnected calls method on socket client", func(t *testing.T) {
		beforeEach(t)

		SetConnect(FakeSocketConnect)

		client, _ := MakeMercuryClient()
		socket, _ := client.(*Client)
		fake, _ := socket.socket.(*FakeSocketClient)

		fake.SetConnected(true)
		assert.True(t, client.IsConnected(), "Client should be connected when socket client is connected")

		fake.SetConnected(false)
		assert.False(t, client.IsConnected(), "Client should not be connected when socket client is not connected")

	})
}

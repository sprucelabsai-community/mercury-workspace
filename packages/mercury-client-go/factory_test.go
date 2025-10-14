package mercuryclientgo

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFactory(t *testing.T) {
	t.Run("can get back client", func(t *testing.T) {
		factory := Factory{}
		assert.NotNil(t, factory, "factory should not be nil")
	})

	t.Run("returns error with bad url 1", func(t *testing.T) {
		_, err := MakeClient("http://bad-url")
		assert.Error(t, err, "Bad url should have returned an error")
	})

	t.Run("returns error with bad url 2", func(t *testing.T) {
		_, err := MakeClient("http://another-bad-url")
		assert.Error(t, err, "Bad url should have returned an error")
	})

	t.Run("can connect/disconnect client", func(t *testing.T) {
		client, err := MakeClient()
		assert.NoError(t, err, "Factory.Client should not return an error")
		assert.True(t, client.IsConnected(), "Client should be connected on construction")
		client.Disconnect()
		assert.False(t, client.IsConnected(), "Client should be disconnected after disconnect")
	})
}

func MakeClient(baseURL ...string) (MercuryClient, error) {
	host := os.Getenv("HOST")

	if len(baseURL) > 0 {
		host = baseURL[0]
	}

	if host == "" {
		host = "http://localhost:8081"
	}
	factory := Factory{}
	return factory.Client(host)
}

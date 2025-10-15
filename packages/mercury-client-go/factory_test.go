package mercuryclientgo

import (
	"testing"
	"time"

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

	t.Run("sets expected default options when none are provided", func(t *testing.T) {
		beforeEach(t)
		fake, _ := MakeFakeClient()
		opts := fake.GetOptions()
		assert.NotNil(t, opts, "Options should not be nil")
		assert.Equal(t, 10*time.Second, opts.Timeout(), "Timeout should be 10 seconds by default")
		assert.True(t, opts.Reconnection(), "Reconnection should be true by default")
	})

	t.Run("can set reconnect to false", func(t *testing.T) {
		beforeEach(t)
		fake, _ := MakeFakeClient(MercuryClientOptions{ShouldRetryConnect: false, Host: "http://waka-waka"})
		opts := fake.GetOptions()
		assert.NotNil(t, opts, "Options should not be nil")
		assert.False(t, opts.Reconnection(), "Reconnection should be false when set to false")
		assert.Equal(t, "http://waka-waka", fake.GetHost(), "Host should be set to http://waka-waka")
	})

	t.Run("returns error with bad url 1", func(t *testing.T) {
		beforeEach(t)
		_, err := MakeMercuryClient(MercuryClientOptions{Host: "aoeuao://bad-url", ShouldRetryConnect: false})
		assert.Error(t, err, "Bad url should have returned an error")
	})

	t.Run("returns error with bad url 2", func(t *testing.T) {
		beforeEach(t)
		_, err := MakeMercuryClient(MercuryClientOptions{Host: "http://aoeu333another-bad-uaoeuaoeurl", ShouldRetryConnect: false})
		assert.Error(t, err, "Bad url should have returned an error")
	})

	t.Run("can connect and disconnect client", func(t *testing.T) {
		beforeEach(t)
		client, err := MakeMercuryClient()
		assert.NoError(t, err, "Factory.Client should not return an error")
		assert.True(t, client.IsConnected(), "Client should be connected on construction")
		client.Disconnect()
		assert.False(t, client.IsConnected(), "Client should be disconnected after disconnect")
	})

	t.Run("IsConnected calls method on socket client", func(t *testing.T) {
		beforeEach(t)
		fake, client := MakeFakeClient()

		fake.SetConnected(true)
		assert.True(t, client.IsConnected(), "Client should be connected when socket client is connected")

		fake.SetConnected(false)
		assert.False(t, client.IsConnected(), "Client should not be connected when socket client is not connected")

	})

	t.Run("Can emit whoami and get back anon", func(t *testing.T) {
		beforeEach(t)
		client, _ := MakeMercuryClient()
		authMap := emitWhoAmI(t, client)
		assert.Equal(t, "anonymous", authMap["type"], "Auth should be anonymous")
		client.Disconnect()
	})

	t.Run("Can login and get back whoami", func(t *testing.T) {
		beforeEach(t)
		client, _ := MakeMercuryClient()

		requestPinResponse, _ := client.Emit("request-pin::v2020_12_25", TargetAndPayload{
			Payload: map[string]any{
				"phone": "+1 555-555-5555",
			},
		})
		first := requestPinResponse[0]
		challenge := first["challenge"].(string)

		confirmPinResponse, _ := client.Emit("confirm-pin::v2020_12_25", TargetAndPayload{
			Payload: map[string]any{
				"challenge": challenge,
				"pin":       "0000",
			},
		})

		person := confirmPinResponse[0]["person"].(map[string]any)

		authResponse := emitWhoAmI(t, client)
		authMap := authResponse["auth"].(map[string]any)
		authPerson := authMap["person"].(map[string]any)
		assert.Equal(t, person["id"], authPerson["id"], "Person id should match")
	})
}

func emitWhoAmI(t *testing.T, client MercuryClient) map[string]any {
	auth, err := client.Emit("whoami::v2020_12_25")
	assert.NoError(t, err, "Emit whoami should not return an error")
	assert.NotNil(t, auth, "Emit whoami should return a response")
	assert.Equal(t, 1, len(auth), "Emit whoami should return one response")
	authMap := auth[0]
	return authMap
}

func MakeFakeClient(opts ...MercuryClientOptions) (*FakeSocketClient, MercuryClient) {
	SetConnect(FakeSocketConnect)
	client, _ := MakeMercuryClient(opts...)
	socket, _ := client.(*Client)
	fake, _ := socket.socket.(*FakeSocketClient)

	return fake, client
}

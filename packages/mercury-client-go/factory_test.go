package mercuryclientgo

import (
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	spruce "github.com/sprucelabsai-community/spruce-core-schemas/v41/pkg/schemas"
	schemas "github.com/sprucelabsai-community/spruce-core-schemas/v41/pkg/schemas/spruce/v2020_07_22"
	"github.com/stretchr/testify/require"
)

func beforeEach(t *testing.T) {
	t.Helper()
	SetConnect(nil)
}

func TestFactory(t *testing.T) {

	godotenv.Load(".env")

	t.Run("can get back client", func(t *testing.T) {
		beforeEach(t)
		factory := Factory{}
		require.NotNil(t, factory, "factory should not be nil")
	})

	t.Run("sets expected default options when none are provided", func(t *testing.T) {
		beforeEach(t)
		fake, _ := MakeFakeClient()
		opts := fake.GetOptions()
		require.NotNil(t, opts, "Options should not be nil")
		require.Equal(t, 10*time.Second, opts.Timeout(), "Timeout should be 10 seconds by default")
		require.True(t, opts.Reconnection(), "Reconnection should be true by default")
	})

	t.Run("can set reconnect to false", func(t *testing.T) {
		beforeEach(t)
		fake, _ := MakeFakeClient(MercuryClientOptions{ShouldRetryConnect: false, Host: "http://waka-waka"})
		opts := fake.GetOptions()
		require.NotNil(t, opts, "Options should not be nil")
		require.False(t, opts.Reconnection(), "Reconnection should be false when set to false")
		require.Equal(t, "http://waka-waka", fake.GetHost(), "Host should be set to http://waka-waka")
	})

	t.Run("returns error with bad url 1", func(t *testing.T) {
		beforeEach(t)
		_, err := MakeMercuryClient(MercuryClientOptions{Host: "aoeuao://bad-url", ShouldRetryConnect: false})
		require.Error(t, err, "Bad url should have returned an error")
	})

	t.Run("returns error with bad url 2", func(t *testing.T) {
		beforeEach(t)
		_, err := MakeMercuryClient(MercuryClientOptions{Host: "enon://aoeu333another-bad-uaoeuaoeurl", ShouldRetryConnect: false})
		require.Error(t, err, "Bad url should have returned an error")
	})

	t.Run("can connect and disconnect client", func(t *testing.T) {
		beforeEach(t)
		client, err := MakeClientWithTestHost()
		require.NoError(t, err, "Factory.Client should not return an error")
		require.True(t, client.IsConnected(), "Client should be connected on construction")
		client.Disconnect()
		require.False(t, client.IsConnected(), "Client should be disconnected after disconnect")
	})

	t.Run("IsConnected calls method on socket client", func(t *testing.T) {
		beforeEach(t)
		fake, client := MakeFakeClient()

		fake.SetConnected(true)
		require.True(t, client.IsConnected(), "Client should be connected when socket client is connected")

		fake.SetConnected(false)
		require.False(t, client.IsConnected(), "Client should not be connected when socket client is not connected")

	})

	t.Run("defaults host is https://mercury.spruce.ai", func(t *testing.T) {
		beforeEach(t)
		fake, _ := MakeFakeClient()
		require.Equal(t, "https://mercury.spruce.ai", fake.GetHost(), "Default host should be https://mercury.spruce.ai")
	})

	t.Run("can emit whoami and get back anon", func(t *testing.T) {
		beforeEach(t)
		client, _ := MakeClientWithTestHost()
		_, authType := emitWhoAmI(t, client)
		require.Equal(t, "anonymous", authType, "Auth should be anonymous")
		client.Disconnect()
	})

	t.Run("can login and get back whoami", func(t *testing.T) {
		beforeEach(t)
		client, person, _ := loginAsDemoPerson("+1 555-555-5555")
		person2, _ := emitWhoAmI(t, client)
		require.Equal(t, person.Id, person2.Id, "Person id should match")
	})

	t.Run("can authenticate as person in new client", func(t *testing.T) {
		beforeEach(t)
		_, person, token := loginAsDemoPerson("+1 555-555-5555")
		fmt.Println("Logged in as person:", person)

		client, _ := MakeClientWithTestHost()
		client.Authenticate(AuthenticatePayload{
			Token: token,
		})

		person2, _ := emitWhoAmI(t, client)
		require.Equal(t, person.Id, person2.Id, "Person id should match")
	})

	t.Run("handles one skill emitting to another skill", func(t *testing.T) {
		beforeEach(t)
		client, _, _ := loginAsDemoPerson("+1 555-555-5555")
		org, err := seedRandomOrg(client)
		require.NoError(t, err, "Seeding organization should not return an error")

		skill1Client := seedSkillInstallToOrgAndLoginAsSkill(t, client, org)
		skill2Client := seedSkillInstallToOrgAndLoginAsSkill(t, client, org)

		results, err := skill1Client.Emit('register-events::v2020_12_25')


	})
}

func seedSkillInstallToOrgAndLoginAsSkill(t *testing.T, client MercuryClient, org *spruce.Organization) MercuryClient {
	skill, err := seedRandomSkill(client)
	require.NoError(t, err, "Seeding skill should not return an error")
	fmt.Println("Seeded skill:", skill)
	err = installSkill(client, org.Id, skill.Id)
	require.NoError(t, err, "Installing skill should not return an error")

	skill1Client, err := loginAsSkill(skill)
	require.NoError(t, err, "Logging in as skill1 should not return an error")
	return skill1Client
}

func loginAsSkill(skill *spruce.Skill) (MercuryClient, error) {
	client, _ := MakeClientWithTestHost()
	_, err := client.Authenticate(AuthenticatePayload{
		SkillId: skill.Id,
		ApiKey:  skill.ApiKey,
	})

	return client, err
}

func loginAsDemoPerson(phone string) (MercuryClient, *spruce.Person, string) {
	client, _ := MakeClientWithTestHost()
	person, token := login(client, phone)
	return client, person, token
}

func seedRandomOrg(client MercuryClient) (*spruce.Organization, error) {
	orgName := fmt.Sprintf("Test Org %s", uuid.NewString())
	results, err := client.Emit("create-organization::v2020_12_25", TargetAndPayload{
		Payload: map[string]any{
			"name": orgName,
		},
	})

	if err != nil {
		return nil, err
	}

	fmt.Println("Create organization results:", results)
	first := results[0]

	orgValues, ok := first["organization"].(map[string]any)
	if !ok {
		return nil, fmt.Errorf("organization field not found in response")
	}

	org, err := schemas.MakeOrganization(orgValues)
	if err != nil {
		return nil, err
	}

	return org, nil
}

func seedRandomSkill(client MercuryClient) (*spruce.Skill, error) {
	skillName := fmt.Sprintf("Test Skill %s", uuid.NewString())
	results, err := client.Emit("register-skill::v2020_12_25", TargetAndPayload{
		Payload: map[string]any{
			"name": skillName,
		},
	})

	if err != nil {
		return nil, err
	}

	first := results[0]
	skillValues, ok := first["skill"].(map[string]any)

	if !ok {
		return nil, fmt.Errorf("skill field not found in response")
	}

	skill, err := schemas.MakeSkill(skillValues)
	if err != nil {
		return nil, err
	}

	return skill, nil
}

func installSkill(client MercuryClient, orgId string, skillId string) error {
	_, err := client.Emit("install-skill::v2020_12_25", TargetAndPayload{
		Target: map[string]any{
			"organizationId": orgId,
		},
		Payload: map[string]any{
			"skillId": skillId,
		},
	})
	return err
}

func login(client MercuryClient, phone string) (*spruce.Person, string) {
	requestPinResponse, _ := client.Emit("request-pin::v2020_12_25", TargetAndPayload{
		Payload: map[string]any{
			"phone": phone,
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

	first = confirmPinResponse[0]
	token := first["token"].(string)
	personValues := first["person"].(map[string]any)
	person, _ := schemas.MakePerson(personValues)

	return person, token
}

func emitWhoAmI(t *testing.T, client MercuryClient) (*spruce.Person, string) {
	auth, err := client.Emit("whoami::v2020_12_25")
	require.NoError(t, err, "Emit whoami should not return an error")
	require.NotNil(t, auth, "Emit whoami should return a response")
	require.Equal(t, 1, len(auth), "Emit whoami should return one response")
	first := auth[0]

	authMap := first["auth"].(map[string]any)

	authType := first["type"].(string)
	if authType == "anonymous" {
		return nil, "anonymous"
	}

	authPerson := authMap["person"].(map[string]any)
	person, err := schemas.MakePerson(authPerson)
	require.NoError(t, err, "Making person from whoami response should not return an error")
	require.NotNil(t, person, "Person from whoami should not be nil")

	return person, authType
}

func MakeFakeClient(opts ...MercuryClientOptions) (*FakeSocketClient, MercuryClient) {
	SetConnect(FakeSocketConnect)
	client, _ := MakeMercuryClient(opts...)
	socket, _ := client.(*Client)
	fake, _ := socket.socket.(*FakeSocketClient)
	return fake, client
}

func MakeClientWithTestHost(opts ...MercuryClientOptions) (MercuryClient, error) {
	host := os.Getenv("TEST_HOST")
	if host == "" {
		return nil, fmt.Errorf("TEST_HOST environment variable is not set")
	}

	return MakeMercuryClient(append(opts, MercuryClientOptions{Host: host})...)
}

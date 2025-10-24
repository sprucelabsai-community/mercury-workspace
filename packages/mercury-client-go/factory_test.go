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
		client.Disconnect()
	})

	t.Run("can authenticate as person in new client", func(t *testing.T) {
		beforeEach(t)
		c, person, token := loginAsDemoPerson("+1 555-555-5555")
		c.Disconnect()

		fmt.Println("Logged in as person:", person)

		client, _ := MakeClientWithTestHost()
		client.Authenticate(AuthenticatePayload{
			Token: token,
		})

		person2, _ := emitWhoAmI(t, client)
		require.Equal(t, person.Id, person2.Id, "Person id should match")

		client.Disconnect()
	})

	t.Run("Remote throwing should return error", func(t *testing.T) {
		beforeEach(t)
		client, _ := MakeClientWithTestHost()
		_, err := client.Emit("this-event-does-not-exist::v2020_12_25")
		require.Error(t, err, "Emitting non-existent event should return an error")

		client.Disconnect()
	})

	t.Run("handles one skill emitting to another skill", func(t *testing.T) {
		beforeEach(t)
		org, skill1Client, skill2Client, fqen := loginCreatOrgSetup2SkillsAndRegisterEventContractAsSkill1(t)

		var wasHit = false
		messages := []string{generateRandomId(), generateRandomId(), generateRandomId()}

		skill2Client.On(fqen, func(targetAndPayload TargetAndPayload) any {
			wasHit = true
			return map[string]any{
				"messages": messages,
			}
		})

		results := emitSkillEvent(t, skill1Client, fqen, org.Id)

		require.True(t, wasHit, "Event handler should have been hit")
		require.Equal(t, 1, len(results), "There should be one result")

		first := results[0]
		returnedMessages, ok := first["messages"].([]any)

		require.True(t, ok, "Messages field should be present in response")

		require.Equal(t, len(messages), len(returnedMessages), "Returned messages length should match sent messages length")
		require.Equal(t, messages[0], returnedMessages[0], "Returned message should match sent message")

		skill1Client.Disconnect()
		skill2Client.Disconnect()
	})

	t.Run("listeners get actual target and payload", func(t *testing.T) {
		beforeEach(t)
		org, skill1Client, skill2Client, fqen := loginCreatOrgSetup2SkillsAndRegisterEventContractAsSkill1(t)

		var passedTargetAndPayload TargetAndPayload
		skill2Client.On(fqen, func(targetAndPayload TargetAndPayload) any {
			passedTargetAndPayload = targetAndPayload
			return map[string]any{
				"messages": []string{generateRandomId()},
			}
		})

		actualTargetAndPayload := TargetAndPayload{
			Target: map[string]any{
				"organizationId": org.Id,
			},
			Payload: map[string]any{
				"message": generateRandomId(),
			},
		}

		_, err := skill1Client.Emit(fqen, actualTargetAndPayload)
		require.NoError(t, err, "Emitting custom event should not return an error")

		// check passed and actual match
		require.Equal(t, actualTargetAndPayload.Target, passedTargetAndPayload.Target, "Targets should match")
		require.Equal(t, actualTargetAndPayload.Payload, passedTargetAndPayload.Payload, "Payloads should match")

		skill1Client.Disconnect()
		skill2Client.Disconnect()

	})

	t.Run("can turn off listeners", func(t *testing.T) {
		org, skill1Client, skill2Client, fqen := loginCreatOrgSetup2SkillsAndRegisterEventContractAsSkill1(t)

		hitCount := 0
		skill2Client.On(fqen, func(targetAndPayload TargetAndPayload) any {
			hitCount++
			return map[string]any{
				"messages": []string{generateRandomId()},
			}
		})

		emitSkillEvent(t, skill1Client, fqen, org.Id)

		skill2Client.Off(fqen)

		emitSkillEvent(t, skill1Client, fqen, org.Id)

		require.Equal(t, 1, hitCount, "Hit count should be 1 after turning off listener")

		skill1Client.Disconnect()
		skill2Client.Disconnect()
	})
}

func emitSkillEvent(t *testing.T, skill1Client MercuryClient, fqen string, orgId string) []ResponsePayload {
	results, err := skill1Client.Emit(fqen, TargetAndPayload{
		Target: map[string]any{
			"organizationId": orgId,
		},
		Payload: map[string]any{
			"message": generateRandomId(),
		},
	})

	require.NoError(t, err, "Emitting event should not return an error")
	require.NotNil(t, results, "Results should not be nil")

	return results
}

func loginCreatOrgSetup2SkillsAndRegisterEventContractAsSkill1(t *testing.T) (*spruce.Organization, MercuryClient, MercuryClient, string) {
	client, _, _ := loginAsDemoPerson("+1 555-555-5555")
	org := seedRandomOrg(t, client)
	skill1Client := seedSkillInstallToOrgAndLoginAsSkill(t, client, org)
	skill2Client := seedSkillInstallToOrgAndLoginAsSkill(t, client, org)
	fqen := registerTestContract(t, skill1Client)

	client.Disconnect()
	return org, skill1Client, skill2Client, fqen
}

func registerEvents(t *testing.T, client MercuryClient, eventContract EventContract) string {
	results, err := client.Emit("register-events::v2020_12_25", TargetAndPayload{
		Payload: map[string]any{
			"contract": eventContract,
		},
	})

	require.NoError(t, err, "Registering events should not return an error")
	require.NotNil(t, results, "Registering events should return results")

	first := results[0]
	fqenValues, ok := first["fqens"].([]any)
	require.True(t, ok, "FQENS slice should be present in response")
	require.NotEmpty(t, fqenValues, "FQENS slice should not be empty")

	fqen, ok := fqenValues[0].(string)
	require.True(t, ok, "First FQEN entry should be a string")
	return fqen
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

func generateRandomId() string {
	return uuid.NewString()
}

func seedRandomOrg(t *testing.T, client MercuryClient) *spruce.Organization {
	orgName := fmt.Sprintf("Test Org %s", generateRandomId())
	results, err := client.Emit("create-organization::v2020_12_25", TargetAndPayload{
		Payload: map[string]any{
			"name": orgName,
		},
	})

	require.NoError(t, err, "Seeding organization should not return an error")

	fmt.Println("Create organization results:", results)
	first := results[0]

	orgValues, ok := first["organization"].(map[string]any)
	require.True(t, ok, "Organization field should be present in response")
	org, err := schemas.MakeOrganization(orgValues)
	require.NoError(t, err, "Making organization from response should not return an error")

	return org
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

type EventContract map[string]any

func generateWillSendVipEventSignature(slug ...string) EventContract {
	namespace := ""
	if len(slug) > 0 && slug[0] != "" {
		namespace = slug[0] + "."
	}

	return EventContract{
		"eventSignatures": map[string]any{
			fmt.Sprintf("%swill-send-vip::v1", namespace): map[string]any{
				"emitPayloadSchema": map[string]any{
					"id": "willSendVipTargetAndPayload",
					"fields": map[string]any{
						"target": map[string]any{
							"type":       "schema",
							"isRequired": true,
							"options": map[string]any{
								"schema": map[string]any{
									"id": "willSendVipTarget",
									"fields": map[string]any{
										"organizationId": map[string]any{
											"type": "text",
										},
									},
								},
							},
						},
						"payload": map[string]any{
							"type":       "schema",
							"isRequired": true,
							"options": map[string]any{
								"schema": map[string]any{
									"id": "willSendVipPayload",
									"fields": map[string]any{
										"message": map[string]any{
											"type": "text",
										},
									},
								},
							},
						},
					},
				},
				"responsePayloadSchema": map[string]any{
					"id": "testEventResponsePayload",
					"fields": map[string]any{
						"messages": map[string]any{
							"type":       "text",
							"isArray":    true,
							"isRequired": true,
						},
					},
				},
			},
		},
	}
}

func registerTestContract(t *testing.T, client MercuryClient) string {
	eventContract := generateWillSendVipEventSignature()
	require.NotNil(t, eventContract, "Expected event contract to be generated")

	fqen := registerEvents(t, client, eventContract)
	fmt.Println("Registered FQEN:", fqen)
	return fqen
}

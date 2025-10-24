package mercuryclientgo

import (
	"os"

	spruce "github.com/sprucelabsai-community/spruce-core-schemas/v41/pkg/schemas"
)

type (
	Factory struct{}

	MercuryClientOptions struct {
		TimeoutSec         int
		Host               string
		ShouldRetryConnect bool
	}

	TargetAndPayload struct {
		Source  map[string]any `json:"source,omitempty"`
		Target  map[string]any `json:"target,omitempty"`
		Payload map[string]any `json:"payload,omitempty"`
	}

	ResponsePayload = map[string]any

	MercurySingleResponse struct {
		ResponderRef string          `json:"responderRef"`
		Errors       []any           `json:"errors"`
		Payload      ResponsePayload `json:"payload"`
	}

	MercuryAggregateResponse struct {
		TotalContracts float64                 `json:"totalContracts"`
		TotalResponses float64                 `json:"totalResponses"`
		TotalErrors    float64                 `json:"totalErrors"`
		Responses      []MercurySingleResponse `json:"responses"`
	}

	AuthenticatePayload struct {
		SkillId string
		ApiKey  string
		Token   string
	}

	AuthenticatResponse struct {
		Skill  *spruce.Skill
		Person *spruce.Person
	}

	MercuryListener = func(targetAndPayload TargetAndPayload) any

	MercuryClient interface {
		Connect(url string, opts MercuryClientOptions) error
		Disconnect()
		IsConnected() bool
		Emit(event string, targetAndPayload ...TargetAndPayload) ([]ResponsePayload, error)
		Authenticate(opts AuthenticatePayload) (*AuthenticatResponse, error)
		On(event string, listener MercuryListener)
		Off(event string, listener ...MercuryListener)
	}
)

func (f *Factory) Client(host string, opts ...MercuryClientOptions) (MercuryClient, error) {
	client := &Client{}

	var options MercuryClientOptions
	if len(opts) > 0 {
		options = opts[0]
	} else {
		options = defaultMercuryClientOptions()
	}

	if options.TimeoutSec == 0 {
		options.TimeoutSec = 10
	}

	if err := client.Connect(host, options); err != nil {
		return nil, err
	}

	return client, nil
}

func MakeMercuryClient(opts ...MercuryClientOptions) (MercuryClient, error) {
	host := os.Getenv("HOST")

	if len(opts) > 0 {
		host = opts[0].Host
	}

	if host == "" {
		host = "https://mercury.spruce.ai"
	}

	factory := Factory{}
	return factory.Client(host, opts...)
}

func defaultMercuryClientOptions() MercuryClientOptions {
	return MercuryClientOptions{
		TimeoutSec:         10,
		ShouldRetryConnect: true,
	}
}

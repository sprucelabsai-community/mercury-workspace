package mercuryclientgo

import (
	"os"
)

type (
	Factory struct{}

	MercuryClientOptions struct {
		TimeoutSec         int
		Host               string
		ShouldRetryConnect bool
	}

	TargetAndPayload struct {
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

	MercuryClient interface {
		Connect(url string, opts MercuryClientOptions) error
		Disconnect()
		IsConnected() bool
		Emit(event string, targetAndPayload ...TargetAndPayload) ([]map[string]any, error)
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
		host = "http://localhost:8081"
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

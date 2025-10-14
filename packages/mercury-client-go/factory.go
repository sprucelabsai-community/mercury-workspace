package mercuryclientgo

import "os"

type Factory struct{}

type MercuryClient interface {
	Connect(url string) error
	Disconnect()
	IsConnected() bool
}

func (f *Factory) Client(baseURL string) (MercuryClient, error) {
	client := &Client{}
	if err := client.Connect(baseURL); err != nil {
		return nil, err
	}
	return client, nil
}

func MakeMercuryClient(baseURL ...string) (MercuryClient, error) {
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

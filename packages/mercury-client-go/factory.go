package mercuryclientgo

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

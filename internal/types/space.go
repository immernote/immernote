package types

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type SpaceSettings map[string]string

func (s *SpaceSettings) Scan(value interface{}) error {
	var source []byte
	switch value := value.(type) {
	case string:
		source = []byte(value)
	case []byte:
		source = value
	default:
		return errors.New("incompatible type for SpaceSettings")
	}

	ss := make(SpaceSettings)

	if err := json.Unmarshal(source, &ss); err != nil {
		return err
	}

	*s = ss

	return nil
}

// Value return json value, implement driver.Valuer interface
func (s SpaceSettings) Value() (driver.Value, error) {
	b, err := json.Marshal(s)
	if err != nil {
		return nil, err
	}

	return string(b), nil
}

type SpaceIcon struct {
	Type    string `json:"type"`
	Content string `json:"value"`
}

func (s *SpaceIcon) Scan(value interface{}) error {
	var source []byte
	switch value := value.(type) {
	case string:
		source = []byte(value)
	case []byte:
		source = value
	default:
		return errors.New("incompatible type for SpaceIcon")
	}

	ss := SpaceIcon{}

	if err := json.Unmarshal(source, &ss); err != nil {
		return err
	}

	*s = ss

	return nil
}

// Value return json value, implement driver.Valuer interface
func (s SpaceIcon) Value() (driver.Value, error) {
	b, err := json.Marshal(s)
	if err != nil {
		return nil, err
	}

	return string(b), nil
}

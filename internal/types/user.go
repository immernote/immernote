package types

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type UserSettings map[string]string

func (s *UserSettings) Scan(value interface{}) error {
	var source []byte
	switch value := value.(type) {
	case string:
		source = []byte(value)
	case []byte:
		source = value
	default:
		return errors.New("incompatible type for UserSettings")
	}

	ss := make(UserSettings)

	if err := json.Unmarshal(source, &ss); err != nil {
		return err
	}

	*s = ss

	return nil
}

// Value return json value, implement driver.Valuer interface
func (s UserSettings) Value() (driver.Value, error) {
	b, err := json.Marshal(s)
	if err != nil {
		return nil, err
	}

	return string(b), nil
}

package types

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type Map map[string]interface{}

func (m *Map) Scan(value interface{}) error {
	var source []byte
	switch value := value.(type) {
	case string:
		source = []byte(value)
	case []byte:
		source = value
	default:
		return errors.New("incompatible type for Map")
	}

	tmp := make(Map)

	if err := json.Unmarshal(source, &tmp); err != nil {
		return err
	}

	*m = tmp

	return nil
}

// Value return json value, implement driver.Valuer interface
func (m Map) Value() (driver.Value, error) {
	b, err := json.Marshal(m)
	if err != nil {
		return nil, err
	}

	return string(b), nil
}

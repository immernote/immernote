package types

import (
	"database/sql/driver"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log"

	"github.com/google/uuid"
)

/* ---------------------------------------------------------------------------------------------- */
/*                                               Map                                              */
/* ---------------------------------------------------------------------------------------------- */

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

/* ---------------------------------------------------------------------------------------------- */
/*                                              UUID                                              */
/* ---------------------------------------------------------------------------------------------- */

type UUID uuid.UUID

// MarshalText implements encoding.TextMarshaler.
func (u UUID) MarshalJSON() ([]byte, error) {
	var js [36]byte
	encode_hex(js[:], u)
	return js[:], nil
}

// UnmarshalText implements encoding.TextUnmarshaler.
func (u *UUID) UnmarshalJSON(data []byte) error {
	log.Println("BYTES: ", data)
	id, err := uuid.ParseBytes(data)
	if err != nil {
		return err
	}
	*u = [16]byte(id)
	return nil
}

func encode_hex(dst []byte, uuid UUID) {
	hex.Encode(dst, uuid[:4])
	dst[8] = '-'
	hex.Encode(dst[9:13], uuid[4:6])
	dst[13] = '-'
	hex.Encode(dst[14:18], uuid[6:8])
	dst[18] = '-'
	hex.Encode(dst[19:23], uuid[8:10])
	dst[23] = '-'
	hex.Encode(dst[24:], uuid[10:])
}

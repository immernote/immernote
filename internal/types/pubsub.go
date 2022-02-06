package types

import "encoding/json"

type Patch struct {
	Op      string          `json:"op"`
	Path    []interface{}   `json:"path"`
	Value   json.RawMessage `json:"value,omitempty"`
	From    []interface{}   `json:"from,omitempty"`
	Version int32           `json:"version,omitempty"`
}

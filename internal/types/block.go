package types

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"sort"
	"strconv"
)

type RankedChild struct {
	ID   string `json:"id"`
	Rank string `json:"rank"`
}

type RankedChildren []string

func (s *RankedChildren) Scan(value interface{}) error {
	var source []byte
	switch value := value.(type) {
	case string:
		source = []byte(value)
	case []byte:
		source = value
	default:
		return errors.New("incompatible type for RankedChildren")
	}

	var rc []RankedChild

	if err := json.Unmarshal(source, &rc); err != nil {
		return err
	}

	sort.Sort(ByRank(rc))

	ranked_children := make(RankedChildren, len(rc))
	for index, child := range rc {
		ranked_children[index] = child.ID
	}

	*s = ranked_children

	return nil
}

// Value return json value, implement driver.Valuer interface
func (s RankedChildren) Value() (driver.Value, error) {
	b, err := json.Marshal(s)
	if err != nil {
		return nil, err
	}

	return string(b), nil
}

type ByRank []RankedChild

func (a ByRank) Len() int { return len(a) }
func (a ByRank) Less(i, j int) bool {
	ai, _ := strconv.ParseFloat(a[i].Rank, 64)
	aj, _ := strconv.ParseFloat(a[i].Rank, 64)

	return ai < aj
}
func (a ByRank) Swap(i, j int) { a[i], a[j] = a[j], a[i] }

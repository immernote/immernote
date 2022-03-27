package action

import (
	"context"
	"encoding/json"

	"github.com/immernote/immernote/internal/database"
)

type Transaction struct {
	Type    string `json:"type"`
	Payload []struct {
		Type    string           `json:"type"`
		Payload *json.RawMessage `json:"payload"`
	} `json:"payload"`
}

func ApplyTransaction(tr Transaction) error {
	tx, err := database.Get().Begin(context.Background())
	if err != nil {
		return err
	}

	for _, item := range tr.Payload {
		switch item.Type {
		case "create_block":
			params := new(CreateBlockParams)
			if err := json.Unmarshal(*item.Payload, params); err != nil {
				return err
			}
			if err := CreateBlock(*params, tx); err != nil {
				return err
			}
		case "update_block":
			params := new(UpdateBlockParams)
			if err := json.Unmarshal(*item.Payload, params); err != nil {
				return err
			}
			if err := UpdateBlock(*params, tx); err != nil {
				return err
			}
		}
	}

	if err := tx.Commit(context.Background()); err != nil {
		return err
	}

	return nil
}

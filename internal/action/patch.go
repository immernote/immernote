package action

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
	"github.com/immernote/immernote/internal/types"
)

/* ---------------------------------------------------------------------------------------------- */
/*                                          ApplyPatches                                          */
/* ---------------------------------------------------------------------------------------------- */

type ApplyPatchesParams struct {
	Patches []types.Patch
	UserID  uuid.UUID
}

func ApplyPatches(params ApplyPatchesParams) error {
	pq := query.New(database.Get())

	tx, err := database.Get().Begin(context.Background())
	if err != nil {
		return err
	}

	for _, patch := range params.Patches {
		if patch.Path[0] != "blocks" {
			tx.Rollback(context.Background())
			return fmt.Errorf("unsupported path %s", patch.Path[0])
		}

		switch patch.Op {
		/* --------------------------------------------- Add -------------------------------------------- */
		case "add":
			value := new(Block)
			if err := json.Unmarshal(patch.Value, value); err != nil {
				return err
			}

			switch value.Type {
			/* ------------------------------------------ Add Page ------------------------------------------ */
			case "page":
				
			/* ---------------------------------------- Add Paragraph --------------------------------------- */
			case "paragraph":
			}
		/* ------------------------------------------- Remove ------------------------------------------- */
		case "remove":
		case "replace":
		case "copy":
		case "move":
		default:
			tx.Rollback(context.Background())
			return fmt.Errorf("unsupported op %s", patch.Op)
		}
	}

	pq.WithTx(tx).CreateSpace(context.Background(), query.CreateSpaceParams{})

	tx.Commit(context.Background())

	return nil
}

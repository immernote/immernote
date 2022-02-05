package action

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
	"github.com/immernote/immernote/internal/types"
	"github.com/immernote/immernote/internal/utils"
	"github.com/jackc/pgtype"
)

/* ---------------------------------------------------------------------------------------------- */
/*                                              Block                                             */
/* ---------------------------------------------------------------------------------------------- */

type Block struct {
	ID       uuid.UUID `json:"id"`
	Type     string    `json:"type"`
	Content  types.Map `json:"content"`
	Format   types.Map `json:"format"`
	SpaceID  uuid.UUID `json:"space_id"`
	Children []string  `json:"children"`

	CreatedBy  uuid.UUID `json:"created_by"`
	ModifiedBy uuid.UUID `json:"modified_by"`

	CreatedAt  time.Time          `json:"created_at"`
	ModifiedAt time.Time          `json:"modified_at"`
	DeletedAt  pgtype.Timestamptz `json:"deleted_at"`
}

/* ---------------------------------------------------------------------------------------------- */
/*                                            GetBlock                                            */
/* ---------------------------------------------------------------------------------------------- */

type GetBlockParams struct {
	ID  string
	Ctx context.Context
}

func GetBlock(params GetBlockParams) (Block, error) {
	id, err := utils.ParseUUID(params.ID)
	if err != nil {
		return Block{}, err
	}

	pq := query.New(database.Get())
	block_row, err := pq.GetBlock(params.Ctx, id)
	if err != nil {
		return Block{}, err
	}

	block := Block{
		ID:         block_row.ID,
		Type:       block_row.Type,
		Content:    block_row.Content,
		Format:     block_row.Format,
		SpaceID:    block_row.SpaceID,
		CreatedBy:  block_row.CreatedBy,
		ModifiedBy: block_row.ModifiedBy,
		CreatedAt:  block_row.CreatedAt,
		ModifiedAt: block_row.ModifiedAt,
		DeletedAt:  block_row.DeletedAt,
		Children:   block_row.Children,
	}

	return block, nil
}

/* ---------------------------------------------------------------------------------------------- */
/*                                           ListBlocks                                           */
/* ---------------------------------------------------------------------------------------------- */

type ListBlocksParams struct {
	IDs         []string
	PageID      string
	ParentID    string
	SpaceHandle string
	SpaceID     string
	Type        string

	// List the entire subtree
	Deep bool

	Ctx context.Context
}

func ListBlocks(params ListBlocksParams) ([]Block, error) {
	blocks := []Block{}

	arg := query.ListBlocksParams{}
	arg.SetIds = len(params.IDs) != 0
	arg.SetPageID = params.PageID != ""
	arg.SetParentID = params.ParentID != ""
	arg.SetSpaceHandle = params.SpaceHandle != ""
	arg.SetSpaceID = params.SpaceID != ""
	arg.SetType = params.Type != ""

	if arg.SetIds {
		ids, err := utils.ParseUUIDList(params.IDs)
		if err != nil {
			return blocks, err
		}

		arg.Ids = ids
	}

	if arg.SetPageID {
		id, err := uuid.Parse(params.PageID)
		if err != nil {
			return blocks, nil
		}

		arg.PageID = id
	}

	if arg.SetParentID {
		id, err := uuid.Parse(params.ParentID)
		if err != nil {
			return blocks, nil
		}

		arg.ParentID = id
	}

	if arg.SetSpaceHandle {
		arg.SpaceHandle = params.SpaceHandle
	}

	if arg.SetSpaceID {
		id, err := uuid.Parse(params.SpaceID)
		if err != nil {
			return blocks, nil
		}

		arg.SpaceID = id
	}

	if arg.SetType {
		arg.Type = params.Type
	}

	pq := query.New(database.Get())
	blocks_row, err := pq.ListBlocks(params.Ctx, arg)
	if err != nil {
		return blocks, err
	}

	for _, row := range blocks_row {
		blocks = append(blocks, Block{
			ID:       row.ID,
			Type:     row.Type,
			Content:  row.Content,
			Format:   row.Format,
			SpaceID:  row.SpaceID,
			Children: row.Children,

			CreatedBy:  row.CreatedBy,
			ModifiedBy: row.ModifiedBy,

			CreatedAt:  row.CreatedAt,
			ModifiedAt: row.ModifiedAt,
			DeletedAt:  row.DeletedAt,
		})
	}

	return blocks, nil
}

/* ---------------------------------------------------------------------------------------------- */
/*                                           CreateBlock                                          */
/* ---------------------------------------------------------------------------------------------- */

type CreateBlockParams struct {
	Type     string
	ID       string
	ParentID string
	PageID   string
}

func CreateBlock(params CreateBlockParams) ([]string, error) {
	return nil, nil
}

/* ---------------------------------------------------------------------------------------------- */
/*                                           PatchBlock                                          */
/* ---------------------------------------------------------------------------------------------- */

type PatchBlockParams struct {
	Type     string
	ID       string
	ParentID string
	PageID   string
}

func PatchBlock(params CreateBlockParams) ([]string, error) {
	return nil, nil
}

/* ---------------------------------------------------------------------------------------------- */
/*                                           DeleteBlock                                          */
/* ---------------------------------------------------------------------------------------------- */

type DeleteBlockParams struct {
	Type     string
	ID       string
	ParentID string
	PageID   string
}

func DeleteBlock(params CreateBlockParams) ([]string, error) {
	return nil, nil
}

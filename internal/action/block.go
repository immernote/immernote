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
	ID         uuid.UUID          `json:"id"`
	Type       string             `json:"type"`
	Content    types.Map          `json:"content"`
	Format     types.Map          `json:"format"`
	SpaceID    uuid.UUID          `json:"space_id"`
	CreatedBy  uuid.UUID          `json:"created_by"`
	ModifiedBy uuid.UUID          `json:"modified_by"`
	CreatedAt  time.Time          `json:"created_at"`
	ModifiedAt time.Time          `json:"modified_at"`
	DeletedAt  pgtype.Timestamptz `json:"deleted_at"`
	Children   []string           `json:"children"`
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
	Type        string
	IDs         []string
	ParentID    string
	PageID      string
	SpaceID     string
	SpaceHandle string

	// List the entire subtree
	Deep bool
}

func ListBlocks(params ListBlocksParams) ([]Block, error) {
	blocks := []Block{}

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

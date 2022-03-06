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
	ID         uuid.UUID   `json:"id"`
	Type       string      `json:"type"`
	Content    types.Map   `json:"content"`
	Format     types.Map   `json:"format"`
	SpaceID    uuid.UUID   `json:"space_id"`
	Children   []uuid.UUID `json:"children"`
	RootPageID *uuid.UUID  `json:"root_page_id"`

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

	if block_row.RootPageID != uuid.Nil {
		block.RootPageID = &block_row.RootPageID
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
	Type        []string

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
	arg.SetType = len(params.Type) != 0

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
		b := Block{
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
		}

		if row.RootPageID != uuid.Nil {
			b.RootPageID = &row.RootPageID
		}

		blocks = append(blocks, b)
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
/*                                           PatchBlocks                                          */
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

/* ---------------------------------------------------------------------------------------------- */
/*                                            AddBlock                                            */
/* ---------------------------------------------------------------------------------------------- */

type AddBlockParams struct {
	ID      string
	Type    string
	Content types.Map
	Format  types.Map
	// Could be nil
	ParentID interface{}
	SpaceID  string
	UserID   uuid.UUID
}

func AddBlock(params AddBlockParams) error {
	pq := query.New(database.Get())

	tx, err := database.Get().Begin(context.Background())
	if err != nil {
		return err
	}

	id, err := uuid.Parse(params.ID)
	if err != nil {
		tx.Rollback(context.Background())
		return err
	}

	space_id, err := uuid.Parse(params.SpaceID)
	if err != nil {
		tx.Rollback(context.Background())
		return err
	}

	parent_id_str := ""
	if str, ok := params.ParentID.(string); ok {
		parent_id_str = str
	}

	parent_id, err := utils.ParseUUID(parent_id_str)
	if err != nil {
		tx.Rollback(context.Background())
		return err
	}

	has_parent := parent_id != uuid.Nil

	if err := pq.WithTx(tx).CreateBlock(context.Background(), query.CreateBlockParams{
		ID:          id,
		Type:        params.Type,
		Content:     params.Content,
		Format:      params.Format,
		SpaceID:     space_id,
		CreatedBy:   params.UserID,
		SetParentID: has_parent,
		ParentID:    parent_id,
	}); err != nil {
		tx.Rollback(context.Background())
		return err
	}

	if has_parent {
		if err := pq.WithTx(tx).CreateBlockEdge(context.Background(), query.CreateBlockEdgeParams{
			ParentID: parent_id,
			BlockID:  id,
		}); err != nil {
			tx.Rollback(context.Background())
			return err
		}
	}

	if params.Type == "page" || params.Type == "database" {
		if has_parent {
			if err := pq.WithTx(tx).PreparePageSets(context.Background(), parent_id); err != nil {
				tx.Rollback(context.Background())
				return err
			}

			if err := pq.WithTx(tx).CreatePageSetByParentID(context.Background(), query.CreatePageSetByParentIDParams{
				PageID:   id,
				ParentID: parent_id,
			}); err != nil {
				tx.Rollback(context.Background())
				return err
			}
		} else {
			if err := pq.WithTx(tx).CreatePageSet(context.Background(), query.CreatePageSetParams{
				RootID: id,
				PageID: id,
				Lft:    1,
				Rgt:    2,
			}); err != nil {
				tx.Rollback(context.Background())
				return err
			}
		}
	}

	if err := tx.Commit(context.Background()); err != nil {
		return err
	}

	return nil
}

/* ---------------------------------------------------------------------------------------------- */
/*                                            AddBlocks                                           */
/* ---------------------------------------------------------------------------------------------- */

type AddBlocksParams struct {
	IDs      []interface{}
	Types    []interface{}
	Contents []interface{}
	Formats  []interface{}
	// Could be nil
	ParentIDs []interface{}
	SpaceID   string
	UserID    uuid.UUID
}

func AddBlocks(params AddBlocksParams) error {
	pq := query.New(database.Get())

	tx, err := database.Get().Begin(context.Background())
	if err != nil {
		return err
	}

	space_id, err := uuid.Parse(params.SpaceID)
	if err != nil {
		tx.Rollback(context.Background())
		return err
	}

	for index, str_id := range params.IDs {
		id, err := uuid.Parse(str_id.(string))
		if err != nil {
			tx.Rollback(context.Background())
			return err
		}

		parent_id_str := ""
		if str, ok := params.ParentIDs[index].(string); ok {
			parent_id_str = str
		}

		parent_id, err := utils.ParseUUID(parent_id_str)
		if err != nil {
			tx.Rollback(context.Background())
			return err
		}

		has_parent := parent_id != uuid.Nil

		if err := pq.WithTx(tx).CreateBlock(context.Background(), query.CreateBlockParams{
			ID:          id,
			Type:        params.Types[index].(string),
			Content:     params.Contents[index].(map[string]interface{}),
			Format:      params.Formats[index].(map[string]interface{}),
			SpaceID:     space_id,
			CreatedBy:   params.UserID,
			SetParentID: has_parent,
			ParentID:    parent_id,
		}); err != nil {
			tx.Rollback(context.Background())
			return err
		}

		if has_parent {
			if err := pq.WithTx(tx).CreateBlockEdge(context.Background(), query.CreateBlockEdgeParams{
				ParentID: parent_id,
				BlockID:  id,
			}); err != nil {
				tx.Rollback(context.Background())
				return err
			}
		}

		if params.Types[index] == "page" || params.Types[index] == "database" {
			if has_parent {
				if err := pq.WithTx(tx).PreparePageSets(context.Background(), parent_id); err != nil {
					tx.Rollback(context.Background())
					return err
				}

				if err := pq.WithTx(tx).CreatePageSetByParentID(context.Background(), query.CreatePageSetByParentIDParams{
					PageID:   id,
					ParentID: parent_id,
				}); err != nil {
					tx.Rollback(context.Background())
					return err
				}
			} else {
				if err := pq.WithTx(tx).CreatePageSet(context.Background(), query.CreatePageSetParams{
					RootID: id,
					PageID: id,
					Lft:    1,
					Rgt:    2,
				}); err != nil {
					tx.Rollback(context.Background())
					return err
				}
			}
		}
	}

	if err := tx.Commit(context.Background()); err != nil {
		return err
	}

	return nil
}

/* ---------------------------------------------------------------------------------------------- */
/*                                          ReplaceBlock                                          */
/* ---------------------------------------------------------------------------------------------- */

type ReplaceBlockParams struct {
	ID      string
	Content interface{}
	Format  interface{}
}

func ReplaceBlock(params ReplaceBlockParams) error {
	pq := query.New(database.Get())

	tx, err := database.Get().Begin(context.Background())
	if err != nil {
		return err
	}

	id, err := uuid.Parse(params.ID)
	if err != nil {
		tx.Rollback(context.Background())
		return err
	}

	content, set_content := params.Content.(map[string]interface{})
	format, set_format := params.Format.(map[string]interface{})

	if err := pq.WithTx(tx).UpdateBlock(context.Background(), query.UpdateBlockParams{
		ID:         id,
		SetContent: set_content,
		Content:    content,
		SetFormat:  set_format,
		Format:     format,
	}); err != nil {
		tx.Rollback(context.Background())
		return err
	}

	if err := tx.Commit(context.Background()); err != nil {
		return err
	}

	return nil
}

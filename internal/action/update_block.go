package action

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
	"github.com/immernote/immernote/internal/types"
	"github.com/jackc/pgtype"
	"github.com/jackc/pgx/v4"
	"github.com/samber/lo"
)

type UpdateBlockParams struct {
	ID       uuid.UUID   `json:"id"`
	Content  *types.Map  `json:"content"`
	Format   *types.Map  `json:"format"`
	ParentID pgtype.UUID `json:"parent_id"`
	By       uuid.UUID   `json:"by"`
	At       time.Time   `json:"at"`
}

func UpdateBlock(params UpdateBlockParams, tx pgx.Tx) error {
	pq := query.New(database.Get())

	// content, set_content := params.Content.(map[string]interface{})
	// format, set_format := params.Format.(map[string]interface{})

	if err := pq.WithTx(tx).UpdateBlock(context.Background(), query.UpdateBlockParams{
		ID:         params.ID,
		SetContent: params.Content == &types.Map{},
		// Is this okay?
		Content:    *params.Content,
		SetFormat:  params.Format == &types.Map{},
		Format:     *params.Format,
		ModifiedBy: params.By,
		ModifiedAt: params.At,
	}); err != nil {
		tx.Rollback(context.Background())
		return err
	}

	if params.ParentID.Status == pgtype.Present {
		if err := pq.WithTx(tx).UpdateBlockEdge(context.Background(), query.UpdateBlockEdgeParams{
			BlockID:  params.ID,
			ParentID: params.ParentID.Bytes,
		}); err != nil {
			tx.Rollback(context.Background())
			return err
		}

		// Step 1: Remove from page sets
		blocks, err := pq.WithTx(tx).DeletePageSets(context.Background(), params.ID)
		if err != nil {
			tx.Rollback(context.Background())
			return err
		}

		root_block, ok := lo.Find(blocks, func(b query.PageSet) bool {
			return b.PageID == params.ID
		})

		if !ok {
			tx.Rollback(context.Background())
			return errors.New("root_block not found")
		}

		if err := pq.WithTx(tx).PopPageSets(context.Background(), query.PopPageSetsParams{
			Rgt:    root_block.Rgt,
			Depth:  root_block.Rgt - root_block.Lft + 1,
			RootID: root_block.RootID,
		}); err != nil {
			tx.Rollback(context.Background())
			return err
		}

		// Step 2: Insert into page sets
		if err := pq.WithTx(tx).PreparePageSets(context.Background(), query.PreparePageSetsParams{
			Depth:    root_block.Rgt - root_block.Lft + 1,
			ParentID: params.ParentID.Bytes,
		}); err != nil {
			tx.Rollback(context.Background())
			return err
		}

		parent_page_set, err := pq.WithTx(tx).GetPageSet(context.Background(), params.ParentID.Bytes)
		if err != nil {
			tx.Rollback(context.Background())
			return err
		}

		if err := pq.WithTx(tx).BatchCreatePageSet(context.Background(), query.BatchCreatePageSetParams{
			RootID: parent_page_set.RootID,
			PageIds: lo.Map(blocks, func(b query.PageSet, i int) uuid.UUID {
				return b.PageID
			}),
			Rgts: lo.Map(blocks, func(b query.PageSet, i int) int32 {
				depth := (root_block.Rgt - root_block.Lft + 1)
				return parent_page_set.Rgt - depth - 1 + b.Rgt - root_block.Lft + 1
			}),
			Lfts: lo.Map(blocks, func(b query.PageSet, i int) int32 {
				depth := (root_block.Rgt - root_block.Lft + 1)
				return parent_page_set.Rgt - depth - 1 + b.Lft - root_block.Lft + 1
			}),
		}); err != nil {
			tx.Rollback(context.Background())
			return err
		}
	}

	if params.ParentID.Status == pgtype.Null {
		if err := pq.WithTx(tx).DeleteBlockEdge(context.Background(), params.ID); err != nil {
			tx.Rollback(context.Background())
			return err
		}

		// Step 1: Remove from page sets
		blocks, err := pq.WithTx(tx).DeletePageSets(context.Background(), params.ID)
		if err != nil {
			tx.Rollback(context.Background())
			return err
		}

		root_block, ok := lo.Find(blocks, func(b query.PageSet) bool {
			return b.PageID == params.ID
		})

		if !ok {
			tx.Rollback(context.Background())
			return errors.New("root_block not found")
		}

		if err := pq.WithTx(tx).PopPageSets(context.Background(), query.PopPageSetsParams{
			Rgt:    root_block.Rgt,
			Depth:  root_block.Rgt - root_block.Lft + 1,
			RootID: root_block.RootID,
		}); err != nil {
			tx.Rollback(context.Background())
			return err
		}

		// Step 2: Insert into page sets
		if err := pq.WithTx(tx).BatchCreatePageSet(context.Background(), query.BatchCreatePageSetParams{
			RootID: params.ID,
			PageIds: lo.Map(blocks, func(b query.PageSet, i int) uuid.UUID {
				return b.PageID
			}),
			Rgts: lo.Map(blocks, func(b query.PageSet, i int) int32 {
				return b.Rgt - root_block.Lft + 1
			}),
			Lfts: lo.Map(blocks, func(b query.PageSet, i int) int32 {
				return b.Lft - root_block.Lft + 1
			}),
		}); err != nil {
			tx.Rollback(context.Background())
			return err
		}
	}

	return nil
}

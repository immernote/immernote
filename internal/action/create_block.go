package action

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
	"github.com/immernote/immernote/internal/types"
	"github.com/immernote/immernote/internal/utils"
	"github.com/jackc/pgx/v4"
)

type CreateBlockParams struct {
	ID       uuid.UUID `json:"id"`
	Type     string    `json:"type"`
	Content  types.Map `json:"content"`
	Format   types.Map `json:"format"`
	SpaceID  uuid.UUID `json:"space_id"`
	ParentID uuid.UUID `json:"parent_id"`
	By       uuid.UUID `json:"by"`
	At       time.Time `json:"at"`
}

func CreateBlock(params CreateBlockParams, tx pgx.Tx) error {
	pq := query.New(database.Get())

	has_parent := params.ParentID != uuid.Nil

	if err := pq.WithTx(tx).CreateBlock(context.Background(), query.CreateBlockParams{
		ID:          params.ID,
		Type:        params.Type,
		Content:     params.Content,
		Format:      params.Format,
		SpaceID:     params.SpaceID,
		CreatedBy:   params.By,
		SetParentID: has_parent,
		ParentID:    params.ParentID,
		TypeLikes:   utils.GetTypeLikes(params.Type),
		CreatedAt:   params.At,
	}); err != nil {
		tx.Rollback(context.Background())
		return err
	}

	if has_parent {
		if err := pq.WithTx(tx).CreateBlockEdge(context.Background(), query.CreateBlockEdgeParams{
			ParentID: params.ParentID,
			BlockID:  params.ID,
		}); err != nil {
			tx.Rollback(context.Background())
			return err
		}
	}

	if utils.IsTypeLike(params.Type, "PageLike") {
		if has_parent {
			if err := pq.WithTx(tx).PreparePageSets(context.Background(), query.PreparePageSetsParams{
				ParentID: params.ParentID,
				Depth:    2,
			}); err != nil {
				tx.Rollback(context.Background())
				return err
			}

			if err := pq.WithTx(tx).CreatePageSetByParentID(context.Background(), query.CreatePageSetByParentIDParams{
				PageID:   params.ID,
				ParentID: params.ParentID,
			}); err != nil {
				tx.Rollback(context.Background())
				return err
			}
		} else {
			if err := pq.WithTx(tx).CreatePageSet(context.Background(), query.CreatePageSetParams{
				RootID: params.ID,
				PageID: params.ID,
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

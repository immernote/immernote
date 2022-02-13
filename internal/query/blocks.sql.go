// Code generated by sqlc. DO NOT EDIT.
// source: blocks.sql

package query

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/types"
	"github.com/jackc/pgtype"
)

const createBlock = `-- name: CreateBlock :exec
INSERT INTO public.blocks ("id", "type", "rank", "content", "format", "space_id", "created_by", "modified_by")
  VALUES ($1, $2, (
      SELECT
        -- Pages are by default inserted at the end
        ((
            CASE WHEN $3::boolean THEN
            (
              SELECT
                COUNT(*)
              FROM
                public.block_edges be
              WHERE
                be.parent_id = $4::uuid)
            ELSE
              0
              -- Start at 1, in case we have to move the page to first position
            END) + 1)::text),
      $5,
      $6,
      $7,
      $8,
      $8)
`

type CreateBlockParams struct {
	ID          uuid.UUID `json:"id"`
	Type        string    `json:"type"`
	SetParentID bool      `json:"set_parent_id"`
	ParentID    uuid.UUID `json:"parent_id"`
	Content     types.Map `json:"content"`
	Format      types.Map `json:"format"`
	SpaceID     uuid.UUID `json:"space_id"`
	CreatedBy   uuid.UUID `json:"created_by"`
}

func (q *Queries) CreateBlock(ctx context.Context, arg CreateBlockParams) error {
	_, err := q.db.Exec(ctx, createBlock,
		arg.ID,
		arg.Type,
		arg.SetParentID,
		arg.ParentID,
		arg.Content,
		arg.Format,
		arg.SpaceID,
		arg.CreatedBy,
	)
	return err
}

const getBlock = `-- name: GetBlock :one
SELECT
  id, type, rank, content, format, space_id, created_by, modified_by, created_at, modified_at, deleted_at,
  COALESCE((
    SELECT
      array_to_json(array_agg(row_to_json(tmp)))
    FROM (
      SELECT
        cb.id, cb.rank FROM blocks cb
      WHERE
        cb.id = ANY (
          SELECT
            be.block_id FROM public.block_edges be
          WHERE
            be.parent_id = b.id)) AS tmp), '[]')::children_list AS children
FROM
  public.blocks b
WHERE
  b.id = $1
`

type GetBlockRow struct {
	ID         uuid.UUID            `json:"id"`
	Type       string               `json:"type"`
	Rank       string               `json:"rank"`
	Content    types.Map            `json:"content"`
	Format     types.Map            `json:"format"`
	SpaceID    uuid.UUID            `json:"space_id"`
	CreatedBy  uuid.UUID            `json:"created_by"`
	ModifiedBy uuid.UUID            `json:"modified_by"`
	CreatedAt  time.Time            `json:"created_at"`
	ModifiedAt time.Time            `json:"modified_at"`
	DeletedAt  pgtype.Timestamptz   `json:"deleted_at"`
	Children   types.RankedChildren `json:"children"`
}

func (q *Queries) GetBlock(ctx context.Context, id uuid.UUID) (GetBlockRow, error) {
	row := q.db.QueryRow(ctx, getBlock, id)
	var i GetBlockRow
	err := row.Scan(
		&i.ID,
		&i.Type,
		&i.Rank,
		&i.Content,
		&i.Format,
		&i.SpaceID,
		&i.CreatedBy,
		&i.ModifiedBy,
		&i.CreatedAt,
		&i.ModifiedAt,
		&i.DeletedAt,
		&i.Children,
	)
	return i, err
}

const listBlocks = `-- name: ListBlocks :many
SELECT
  id, type, rank, content, format, space_id, created_by, modified_by, created_at, modified_at, deleted_at,
  COALESCE((
    SELECT
      array_to_json(array_agg(row_to_json(tmp)))
    FROM (
      SELECT
        cb.id, cb.rank FROM blocks cb
      WHERE
        cb.id = ANY (
          SELECT
            be.block_id FROM public.block_edges be
          WHERE
            be.parent_id = b.id)) AS tmp), '[]')::children_list AS children
FROM
  public.blocks b
WHERE (
  -- Type
  CASE WHEN $1::boolean THEN
    b.type = $2::text
  ELSE
    TRUE
  END)
  AND (
    -- IDs
    CASE WHEN $3::boolean THEN
      b.id = ANY ($4::uuid[])
    ELSE
      TRUE
    END)
  AND (
    -- ParentID
    CASE WHEN $5::boolean THEN
      b.id = ANY (
        SELECT
          be.block_id
        FROM
          public.block_edges be
        WHERE
          be.parent_id = $6::uuid)
      ELSE
        TRUE
    END)
AND (
  -- PageID
  CASE WHEN $7::boolean THEN
    b.id = ANY (
      SELECT
        pb.block_id
      FROM
        public.page_blocks pb
      WHERE
        pb.page_id = $8::uuid)
    ELSE
      TRUE
  END)
AND (
  -- SpaceID
  CASE WHEN $9::boolean THEN
    b.space_id = $10::uuid
  ELSE
    TRUE
  END)
AND (
  -- SpaceHandle
  CASE WHEN $11::boolean THEN
    b.space_id = (
      SELECT
        s.id
      FROM
        public.spaces s
      WHERE
        s.handle = $12::text)
    ELSE
      TRUE
  END)
ORDER BY
  "rank"::real
`

type ListBlocksParams struct {
	SetType        bool        `json:"set_type"`
	Type           string      `json:"type"`
	SetIds         bool        `json:"set_ids"`
	Ids            []uuid.UUID `json:"ids"`
	SetParentID    bool        `json:"set_parent_id"`
	ParentID       uuid.UUID   `json:"parent_id"`
	SetPageID      bool        `json:"set_page_id"`
	PageID         uuid.UUID   `json:"page_id"`
	SetSpaceID     bool        `json:"set_space_id"`
	SpaceID        uuid.UUID   `json:"space_id"`
	SetSpaceHandle bool        `json:"set_space_handle"`
	SpaceHandle    string      `json:"space_handle"`
}

type ListBlocksRow struct {
	ID         uuid.UUID            `json:"id"`
	Type       string               `json:"type"`
	Rank       string               `json:"rank"`
	Content    types.Map            `json:"content"`
	Format     types.Map            `json:"format"`
	SpaceID    uuid.UUID            `json:"space_id"`
	CreatedBy  uuid.UUID            `json:"created_by"`
	ModifiedBy uuid.UUID            `json:"modified_by"`
	CreatedAt  time.Time            `json:"created_at"`
	ModifiedAt time.Time            `json:"modified_at"`
	DeletedAt  pgtype.Timestamptz   `json:"deleted_at"`
	Children   types.RankedChildren `json:"children"`
}

func (q *Queries) ListBlocks(ctx context.Context, arg ListBlocksParams) ([]ListBlocksRow, error) {
	rows, err := q.db.Query(ctx, listBlocks,
		arg.SetType,
		arg.Type,
		arg.SetIds,
		arg.Ids,
		arg.SetParentID,
		arg.ParentID,
		arg.SetPageID,
		arg.PageID,
		arg.SetSpaceID,
		arg.SpaceID,
		arg.SetSpaceHandle,
		arg.SpaceHandle,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []ListBlocksRow{}
	for rows.Next() {
		var i ListBlocksRow
		if err := rows.Scan(
			&i.ID,
			&i.Type,
			&i.Rank,
			&i.Content,
			&i.Format,
			&i.SpaceID,
			&i.CreatedBy,
			&i.ModifiedBy,
			&i.CreatedAt,
			&i.ModifiedAt,
			&i.DeletedAt,
			&i.Children,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateBlock = `-- name: UpdateBlock :exec
UPDATE
  public.blocks
SET
  content = CASE WHEN $1::boolean THEN
    $2
  ELSE
    content
  END,
  "format" = CASE WHEN $3::boolean THEN
    $4
  ELSE
    "format"
  END
WHERE
  id = $5
`

type UpdateBlockParams struct {
	SetContent bool      `json:"set_content"`
	Content    types.Map `json:"content"`
	SetFormat  bool      `json:"set_format"`
	Format     types.Map `json:"format"`
	ID         uuid.UUID `json:"id"`
}

func (q *Queries) UpdateBlock(ctx context.Context, arg UpdateBlockParams) error {
	_, err := q.db.Exec(ctx, updateBlock,
		arg.SetContent,
		arg.Content,
		arg.SetFormat,
		arg.Format,
		arg.ID,
	)
	return err
}

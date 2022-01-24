-- name: ListPageBlocksBySpaceID :many
SELECT
  *
FROM
  public.blocks b
WHERE
  b.type = 'page'
  AND b.space_id = $1
  AND b.parent_page_id = NULL;

-- name: ListPageBlocksBySpaceHandle :many
SELECT
  *
FROM
  public.blocks b
WHERE
  b.type = 'page'
  AND b.space_id = (
    SELECT
      s.id
    FROM
      public.spaces s
    WHERE
      s.handle = $1)
  AND b.parent_page_id = NULL;

-- name: CreatePageBlock :one
INSERT INTO public.blocks ("id", "type", "rank", "content", "format", "parent_block_id", "parent_page_id", "space_id", "created_by", "modified_by")
  VALUES (@id, 'page', @rank, @content, @format, @parent_block_id, @parent_page_id, @space_id, @created_by, @created_by)
RETURNING
  *;


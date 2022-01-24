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
  AND b.parent_page_id IS NULL;

-- name: CreatePageBlock :one
INSERT INTO public.blocks ("id", "type", "rank", "content", "format", "parent_block_id", "parent_page_id", "space_id", "created_by", "modified_by")
  VALUES (@id, 'page', (
      SELECT
        (COUNT(*) + 1)::text
      FROM
        public.blocks b
      WHERE
        b.space_id = @space_id
        -- Avoid comparing NULL
        AND (
          CASE WHEN @parent_page_id::uuid IS NULL THEN
            b.parent_page_id IS NULL
          ELSE
            b.parent_page_id = @parent_page_id::uuid
          END)),
      @content,
      @format,
      @parent_block_id,
      @parent_page_id,
      @space_id,
      @created_by,
      @created_by)
RETURNING
  *;


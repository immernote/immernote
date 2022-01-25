-- name: ListBlocksByTypeSpaceHandleParentPageID :many
SELECT
  *
FROM
  public.blocks b
WHERE
  b.type = @type
  AND b.space_id = (
    SELECT
      s.id
    FROM
      public.spaces s
    WHERE
      s.handle = @space_handle)
  AND b.parent_page_id = @parent_page_id;

-- name: ListBlocksByTypeSpaceHandleNullParentPageID :many
SELECT
  *
FROM
  public.blocks b
WHERE
  b.type = @type
  AND b.space_id = (
    SELECT
      s.id
    FROM
      public.spaces s
    WHERE
      s.handle = @space_handle)
  AND b.parent_page_id IS NULL;

-- name: ListBlocksByTypeSpaceIDParentPageID :many
SELECT
  *
FROM
  public.blocks b
WHERE
  b.type = @type
  AND b.space_id = @space_id
  AND b.parent_page_id = @parent_page_id;

-- name: ListBlocksByTypeSpaceIDNullParentPageID :many
SELECT
  *
FROM
  public.blocks b
WHERE
  b.type = @type
  AND b.space_id = @space_id
  AND b.parent_page_id IS NULL;

-- name: CreatePageBlock :one
INSERT INTO public.blocks ("id", "type", "rank", "content", "format", "parent_block_id", "parent_page_id", "space_id", "created_by", "modified_by")
  VALUES (@id, 'page', (
      SELECT
        -- Pages are by default inserted at the end
        -- Start at 1, in case we have to move the page to first position
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


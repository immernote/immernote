-- name: ListBlocksByTypeSpaceHandleParentPageID :many
SELECT
  *,
  COALESCE((
    SELECT
      array_to_json(array_agg(row_to_json(tmp)))
    FROM (
      SELECT
        cb.id, cb.rank FROM blocks cb
      WHERE
        cb.parent_page_id = b.id) AS tmp), '[]')::children_list AS children
FROM
  public.blocks b
WHERE (
  CASE WHEN nullif (@type::text, '') IS NOT NULL THEN
    b.type = @type::text
  ELSE
    TRUE
  END)
  AND b.space_id = (
    SELECT
      s.id
    FROM
      public.spaces s
    WHERE
      s.handle = @space_handle)
  AND (b.id = @parent_page_id
    OR b.parent_page_id = @parent_page_id);

-- name: ListBlocksByTypeSpaceHandleNullParentPageID :many
SELECT
  *,
  COALESCE((
    SELECT
      array_to_json(array_agg(row_to_json(tmp)))
    FROM (
      SELECT
        cb.id, cb.rank FROM blocks cb
      WHERE
        cb.parent_page_id = b.id) AS tmp), '[]')::children_list AS children
FROM
  public.blocks b
WHERE (
  CASE WHEN nullif (@type::text, '') IS NOT NULL THEN
    b.type = @type::text
  ELSE
    TRUE
  END)
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
  *,
  COALESCE((
    SELECT
      array_to_json(array_agg(row_to_json(tmp)))
    FROM (
      SELECT
        cb.id, cb.rank FROM blocks cb
      WHERE
        cb.parent_page_id = b.id) AS tmp), '[]')::children_list AS children
FROM
  public.blocks b
WHERE (
  CASE WHEN nullif (@type::text, '') IS NOT NULL THEN
    b.type = @type::text
  ELSE
    TRUE
  END)
  AND b.space_id = @space_id
  AND (b.id = @parent_page_id
    OR b.parent_page_id = @parent_page_id);

-- name: ListBlocksByTypeSpaceIDNullParentPageID :many
SELECT
  *,
  COALESCE((
    SELECT
      array_to_json(array_agg(row_to_json(tmp)))
    FROM (
      SELECT
        cb.id, cb.rank FROM blocks cb
      WHERE
        cb.parent_page_id = b.id) AS tmp), '[]')::children_list AS children
FROM
  public.blocks b
WHERE (
  CASE WHEN nullif (@type::text, '') IS NOT NULL THEN
    b.type = @type::text
  ELSE
    TRUE
  END)
  AND b.space_id = @space_id
  AND b.parent_page_id IS NULL;

-- name: GetBlockByID :one
SELECT
  *,
  COALESCE((
    SELECT
      array_to_json(array_agg(row_to_json(tmp)))
    FROM (
      SELECT
        cb.id, cb.rank FROM blocks cb
      WHERE
        cb.parent_page_id = b.id) AS tmp), '[]')::children_list AS children
FROM
  public.blocks b
WHERE
  b.id = $1;

-- name: CreateBlock :one
INSERT INTO public.blocks ("id", "type", "rank", "content", "format", "parent_block_id", "parent_pages_ids", "parent_page_id", "space_id", "created_by", "modified_by")
  VALUES (@id, @type, (
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
      @parent_pages_ids,
      @parent_page_id,
      @space_id,
      @created_by,
      @created_by)
RETURNING
  *;

-- name: UpdateBlockContent :one
UPDATE
  public.blocks
SET
  content = @content
WHERE
  id = @id
RETURNING
  *;


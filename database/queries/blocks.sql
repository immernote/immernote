-- name: ListBlocks :many
SELECT
  *,
  COALESCE((
    SELECT
      array_agg(cb.id ORDER BY cb.rank::real)
    FROM blocks cb
    WHERE
      cb.id = ANY (
        SELECT
          be.block_id
        FROM block_edges be
        WHERE
          be.parent_id = b.id)), '{}')::uuid[] AS children,
  (
    SELECT
      ps.root_id
    FROM
      public.page_sets ps
    WHERE
      ps.page_id = b.id) AS root_page_id
FROM
  public.blocks b
WHERE (
  -- Type
  CASE WHEN @set_type::boolean THEN
    b.type = ANY (@type::text[])
  ELSE
    TRUE
  END)
  AND (
    -- IDs
    CASE WHEN @set_ids::boolean THEN
      b.id = ANY (@ids::uuid[])
    ELSE
      TRUE
    END)
  AND (
    -- ParentID
    CASE WHEN @set_parent_id::boolean THEN
      b.id = ANY (
        SELECT
          be.block_id
        FROM
          public.block_edges be
        WHERE
          be.parent_id = @parent_id::uuid)
      ELSE
        TRUE
    END)
AND (
  -- PageID
  CASE WHEN @set_page_id::boolean THEN
    b.id = ANY (
      SELECT
        pb.block_id
      FROM
        public.page_blocks pb
      WHERE
        pb.page_id = @page_id::uuid)
    ELSE
      TRUE
  END)
AND (
  -- SpaceID
  CASE WHEN @set_space_id::boolean THEN
    b.space_id = @space_id::uuid
  ELSE
    TRUE
  END)
AND (
  -- SpaceHandle
  CASE WHEN @set_space_handle::boolean THEN
    b.space_id = (
      SELECT
        s.id
      FROM
        public.spaces s
      WHERE
        s.handle = @space_handle::text)
    ELSE
      TRUE
  END)
ORDER BY
  "rank"::real;

-- name: GetBlock :one
SELECT
  *,
  COALESCE((
    SELECT
      array_agg(cb.id ORDER BY cb.rank::real)
    FROM blocks cb
    WHERE
      cb.id = ANY (
        SELECT
          be.block_id
        FROM block_edges be
        WHERE
          be.parent_id = b.id)), '{}')::uuid[] AS children,
  (
    SELECT
      ps.root_id
    FROM
      public.page_sets ps
    WHERE
      ps.page_id = b.id) AS root_page_id
FROM
  public.blocks b
WHERE
  b.id = $1;

-- name: CreateBlock :exec
INSERT INTO public.blocks ("id", "type", "rank", "content", "format", "space_id", "created_by", "modified_by", "created_at", "modified_at")
  VALUES (@id, @type, (
      SELECT
        -- Pages are by default inserted at the end
        ((
            CASE WHEN @set_parent_id::boolean THEN
            (
              SELECT
                COUNT(*)
              FROM
                public.block_edges be
              WHERE
                be.parent_id = @parent_id::uuid
                AND (
                  SELECT
                    b.type
                  FROM
                    public.blocks b
                  WHERE
                    b.id = be.block_id) = ANY (@type_likes::text[]))
              ELSE
                0
                -- Start at 1, in case we have to move the page to first position
            END) + 1)::text),
      @content,
      @format,
      @space_id,
      @created_by,
      @created_by,
      @created_at,
      @created_at);

-- name: UpdateBlock :exec
UPDATE
  public.blocks
SET
  content = CASE WHEN @set_content::boolean THEN
    @content
  ELSE
    content
  END,
  "format" = CASE WHEN @set_format::boolean THEN
    @format
  ELSE
    "format"
  END,
  modified_by = @modified_by,
  modified_at = @modified_at
WHERE
  id = @id;


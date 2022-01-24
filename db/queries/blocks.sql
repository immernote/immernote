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


-- name: CreatePageSet :exec
INSERT INTO public.page_sets ("root_id", "page_id", "lft", "rgt")
  VALUES ($1, $2, $3, $4);

-- name: CreatePageSetByParentID :exec
INSERT INTO public.page_sets ("root_id", "page_id", "lft", "rgt")
SELECT
  ps.root_id,
  @page_id,
  ps.rgt - 2,
  ps.lft - 1
FROM
  public.page_sets ps
WHERE
  ps.page_id = @parent_id;

-- name: ListPageSets :many
SELECT
  *
FROM
  public.page_sets ps
WHERE
  ps.root_id = $1
  OR ps.root_id = (
    SELECT
      pss.root_id
    FROM
      public.page_sets pss
    WHERE
      pss.page_id = $1);

-- name: GetPageSet :one
SELECT
  *
FROM
  public.page_sets ps
WHERE
  ps.page_id = $1;

-- name: PreparePageSets :exec
UPDATE
  public.page_sets ps
SET
  ps.rgt = CASE WHEN ps.rgt > parent_set.rgt - 1 THEN
    ps.rgt + 2
  ELSE
    ps.rgt
  END,
  ps.lft = CASE WHEN ps.lft > parent_set.rgt - 1 THEN
    ps.lft + 2
  ELSE
    ps.lft
  END
FROM (
  SELECT
    parent_ps.root_id,
    parent_ps.rgt
  FROM
    public.page_sets parent_ps
  WHERE
    parent_ps.page_id = @parent_id) AS parent_set
WHERE
  ps.root_id = parent_ps.root_id
  AND (ps.lft > parent_set.rgt - 1
    OR ps.rgt > parent_set.rgt - 1);


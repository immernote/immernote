-- name: CreatePageSet :exec
INSERT INTO public.page_sets ("root_id", "page_id", "lft", "rgt")
  VALUES ($1, $2, $3, $4);

-- name: CreatePageSetByParentID :exec
INSERT INTO public.page_sets ("root_id", "page_id", "lft", "rgt")
SELECT
  ps.root_id,
  @page_id,
  ps.rgt - 2,
  ps.rgt - 1
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
  public.page_sets
SET
  rgt = CASE WHEN rgt > parent_set.parent_rgt - 1 THEN
    rgt + 2
  ELSE
    rgt
  END,
  lft = CASE WHEN lft > parent_set.parent_rgt - 1 THEN
    lft + 2
  ELSE
    lft
  END
FROM (
  SELECT
    parent_ps.root_id AS parent_root_id,
    parent_ps.rgt AS parent_rgt
  FROM
    public.page_sets parent_ps
  WHERE
    parent_ps.page_id = @parent_id) AS parent_set
WHERE
  root_id = parent_set.parent_root_id
  AND (lft > parent_set.parent_rgt - 1
    OR rgt > parent_set.parent_rgt - 1);


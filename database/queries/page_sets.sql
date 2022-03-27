-- name: CreatePageSet :exec
INSERT INTO public.page_sets ("root_id", "page_id", "lft", "rgt")
  VALUES ($1, $2, $3, $4);

-- name: BatchCreatePageSet :exec
INSERT INTO public.page_sets ("root_id", "page_id", "lft", "rgt")
SELECT
  @root_id,
  unnest(@page_ids::uuid[]) AS page_id,
  unnest(@lfts::integer[]) AS lft,
  unnest(@rgts::integer[]) AS rgt;

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

-- name: DeletePageSets :many
DELETE FROM public.page_sets
WHERE page_id = ANY (
    SELECT
      ps.page_id
    FROM
      public.page_sets ps
    WHERE
      ps.root_id = (
        SELECT
          sps.root_id
        FROM
          public.page_sets sps
        WHERE
          sps.page_id = @page_id)
        AND ps.lft >= (
          SELECT
            sps.lft
          FROM
            public.page_sets sps
          WHERE
            sps.page_id = @page_id)
          AND ps.rgt <= (
            SELECT
              sps.rgt
            FROM
              public.page_sets sps
            WHERE
              sps.page_id = @page_id))
      RETURNING
        *;

-- name: PreparePageSets :exec
UPDATE
  public.page_sets
SET
  rgt = CASE WHEN rgt > parent_set.parent_rgt - 1 THEN
    rgt + @depth::integer
  ELSE
    rgt
  END,
  lft = CASE WHEN lft > parent_set.parent_rgt - 1 THEN
    lft + @depth::integer
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

-- name: PopPageSets :exec
UPDATE
  public.page_sets
SET
  rgt = CASE WHEN rgt > @rgt THEN
    rgt - @depth
  ELSE
    rgt
  END,
  lft = CASE WHEN lft > @rgt THEN
    lft - @depth
  ELSE
    lft
  END
WHERE
  root_id = @root_id
  AND (lft > @rgt
    OR rgt > @rgt);

-- -- name: UpdatePageSet :exec
-- UPDATE
--   public.page_sets
-- SET
--   rgt = CASE WHEN root_id =  THEN
--     rgt + 2
--   ELSE
--     rgt
--   END,
--   lft = CASE WHEN lft > parent_set.parent_rgt - 1 THEN
--     lft + 2
--   ELSE
--     lft
--   END
-- FROM (
--   SELECT
--     current_ps.root_id AS current_root_id,
--     current_ps.rgt AS current_rgt,
--     current_ps.lft AS current_lft,
--     (current_ps.rgt - current_ps.lft + 1) AS current_depth,
--     -- TODO: Rewrite these 3 subqueries into 1
--     (
--       SELECT
--         npps.root_id
--       FROM public.page_sets npps
--       WHERE
--         npps.page_id = @parent_id) AS new_parent_root_id,
--     (
--       SELECT
--         npps.rgt
--       FROM
--         public.page_sets npps
--       WHERE
--         npps.page_id = @parent_id) AS new_parent_rgt,
--       (
--         SELECT
--           npps.lft
--         FROM
--           public.page_sets npps
--         WHERE
--           npps.page_id = @parent_id) AS new_parent_lft
--       FROM
--         public.page_sets current_ps
--       WHERE
--         current_ps.page_id = @id) AS current_set
--   WHERE (root_id = current_set.current_root_id
--     AND (lft > current_set.current_rgt - 1
--       OR rgt > current_set.current_rgt - 1))
--   OR (root_id = current_set.new_parent_root_id
--     AND (lft > current_set.new_parent_rgt - 1
--       OR rgt > current_set.new_parent_rgt - 1));

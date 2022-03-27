-- name: CreateBlockEdge :exec
INSERT INTO public.block_edges ("parent_id", "block_id")
  VALUES ($1, $2);

-- name: UpdateBlockEdge :exec
UPDATE
  public.block_edges
SET
  parent_id = @parent_id
WHERE
  block_id = @block_id;

-- name: DeleteBlockEdge :exec
DELETE FROM public.block_edges
WHERE block_id = @block_id;


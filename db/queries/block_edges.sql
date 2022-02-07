-- name: CreateBlockEdge :exec
INSERT INTO public.block_edges ("parent_id", "block_id")
  VALUES ($1, $2);


-- name: CreatePageBlock :exec
INSERT INTO public.page_blocks ("page_id", "block_id")
  VALUES ($1, $2);


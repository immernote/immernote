-- name: CreatePageSet :exec
INSERT INTO public.page_sets ("root_id", "page_id", "lft", "rgt")
  VALUES ($1, $2, $3, $4);


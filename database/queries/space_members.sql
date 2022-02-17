-- name: CreateSpaceMember :exec
INSERT INTO public.space_members ("user_id", "space_id", "type")
  VALUES (@user_id, @space_id, @type);


-- name: CreateSpace :exec
INSERT INTO public.spaces ("id", "handle", "name", "icon", "settings", "domains")
  VALUES (@id, @handle, @name, @icon, @settings, @domains);

-- name: ListSpacesByUserID :many
SELECT
  *
FROM
  public.spaces s
WHERE
  s.id = ANY (
    SELECT
      sm.space_id
    FROM
      public.space_members sm
    WHERE
      sm.user_id = $1);


-- name: CreateSpace :exec
INSERT INTO public.spaces ("id", "handle", "name", "icon", "settings", "domains")
  VALUES (@id, @handle, @name, @icon, @settings, @domains);


-- name: UpdateUserConfirmationTokenByID :one
UPDATE
  public.users
SET
  confirmation_token = $2,
  confirmation_sent_at = NOW()
WHERE
  id = $1
RETURNING
  *;

-- name: GetUserByEmail :one
SELECT
  *
FROM
  public.users
WHERE
  email = $1
LIMIT 1;

-- name: HasUserByEmail :one
SELECT
  EXISTS (
    SELECT
      u.id
    FROM
      public.users u
    WHERE
      u.email = $1
    LIMIT 1);

-- name: CreateUserByID :exec
INSERT INTO public.users ("id", "email", "name", "avatar", "settings")
  VALUES (@id, @email, @name, @avatar, @settings);

-- name: HasValidConfirmationTokenByUserID :one
SELECT
  EXISTS (
    SELECT
      1
    FROM
      public.users
    WHERE
      id = $1
      AND confirmation_sent_at >= now() - INTERVAL '15 minutes'
    LIMIT 1);

-- name: UpdateUserConfirmedAtByID :one
UPDATE
  public.users
SET
  confirmed_at = NOW()
WHERE
  id = $1
RETURNING
  *;


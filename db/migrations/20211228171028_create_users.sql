-- migrate:up
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid () NOT NULL PRIMARY KEY,
  email text NOT NULL,
  name text NOT NULL,
  avatar text NOT NULL,
  settings text NOT NULL,
  confirmation_token text,
  confirmation_sent_at timestamptz,
  invited_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  modified_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz
);

CREATE TRIGGER set_modified_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_modified_at ();

-- migrate:down

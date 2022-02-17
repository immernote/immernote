-- migrate:up
CREATE TABLE spaces (
  id uuid DEFAULT gen_random_uuid () NOT NULL PRIMARY KEY,
  handle text NOT NULL,
  name text NOT NULL,
  icon text NOT NULL,
  settings text NOT NULL,
  domains text[] NOT NULL,
  invitation_token text,
  created_at timestamptz DEFAULT now() NOT NULL,
  modified_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz
);

CREATE TRIGGER set_modified_at
  BEFORE UPDATE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_modified_at ();

-- migrate:down

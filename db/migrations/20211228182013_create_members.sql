-- migrate:up
CREATE TYPE member_type AS ENUM (
  'BOT',
  'GUEST',
  'MEMBER',
  'ADMIN'
);

CREATE TABLE space_members (
  user_id uuid NOT NULL REFERENCES users (id),
  space_id uuid NOT NULL REFERENCES spaces (id),
  type member_type NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  modified_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz,
  PRIMARY KEY (user_id, space_id)
);

CREATE TRIGGER set_modified_at
  BEFORE UPDATE ON space_members
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_modified_at ();

-- migrate:down

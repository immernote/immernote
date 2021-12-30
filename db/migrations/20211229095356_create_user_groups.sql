-- migrate:up
CREATE TABLE user_groups (
  id uuid DEFAULT gen_random_uuid () NOT NULL PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  space_id uuid NOT NULL REFERENCES spaces (id),
  created_at timestamptz DEFAULT now() NOT NULL,
  modified_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz
);

CREATE TRIGGER set_modified_at
  BEFORE UPDATE ON user_groups
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_modified_at ();

CREATE TABLE user_group_members (
  user_id uuid NOT NULL REFERENCES users (id),
  user_group_id uuid NOT NULL REFERENCES user_groups (id),
  created_at timestamptz DEFAULT now() NOT NULL,
  modified_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz,
  PRIMARY KEY (user_id, user_group_id)
);

CREATE TRIGGER set_modified_at
  BEFORE UPDATE ON user_group_members
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_modified_at ();

-- migrate:down

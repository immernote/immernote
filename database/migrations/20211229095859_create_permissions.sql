-- migrate:up
CREATE TYPE block_access_level AS ENUM (
  'READ_ONLY',
  'READ_COMMENT',
  'READ_WRITE',
  'ADMIN'
);

CREATE TABLE space_permissions (
  space_id uuid NOT NULL REFERENCES spaces (id),
  block_id uuid NOT NULL REFERENCES blocks (id),
  access_level block_access_level NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  modified_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz,
  PRIMARY KEY (space_id, block_id)
);

CREATE TRIGGER set_modified_at
  BEFORE UPDATE ON space_permissions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_modified_at ();

CREATE TABLE user_group_permissions (
  user_group_id uuid NOT NULL REFERENCES user_groups (id),
  block_id uuid NOT NULL REFERENCES blocks (id),
  access_level block_access_level NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  modified_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz,
  PRIMARY KEY (user_group_id, block_id)
);

CREATE TRIGGER set_modified_at
  BEFORE UPDATE ON user_group_permissions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_modified_at ();

CREATE TABLE user_permissions (
  user_id uuid NOT NULL REFERENCES users (id),
  block_id uuid NOT NULL REFERENCES blocks (id),
  access_level block_access_level NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  modified_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz,
  PRIMARY KEY (user_id, block_id)
);

CREATE TRIGGER set_modified_at
  BEFORE UPDATE ON user_permissions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_modified_at ();

-- migrate:down

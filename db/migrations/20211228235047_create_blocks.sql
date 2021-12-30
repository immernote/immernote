-- migrate:up
CREATE TABLE blocks (
  id uuid DEFAULT gen_random_uuid () NOT NULL PRIMARY KEY,
  type text NOT NULL,
  rank text DEFAULT '0' NOT NULL,
  content text NOT NULL,
  format text NOT NULL,
  parent_block_id uuid REFERENCES blocks (id),
  parent_page_id uuid REFERENCES blocks (id),
  space_id uuid NOT NULL REFERENCES spaces (id),
  created_by uuid NOT NULL REFERENCES users (id),
  modified_by uuid NOT NULL REFERENCES users (id),
  created_at timestamptz DEFAULT now() NOT NULL,
  modified_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz
);

CREATE TRIGGER set_modified_at
  BEFORE UPDATE ON blocks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_modified_at ();

-- migrate:down

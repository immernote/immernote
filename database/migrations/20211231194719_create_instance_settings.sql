-- migrate:up
CREATE TABLE instance_settings (
  setting_key text NOT NULL PRIMARY KEY,
  setting_value text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  modified_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz
);

-- migrate:down


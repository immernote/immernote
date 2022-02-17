-- migrate:up
ALTER TABLE blocks
  DROP COLUMN parent_block_id,
  DROP COLUMN parent_page_id,
  DROP COLUMN parent_pages_ids;

CREATE TABLE block_edges (
  parent_id uuid NOT NULL REFERENCES blocks (id),
  block_id uuid NOT NULL REFERENCES blocks (id),
  CHECK (parent_id <> block_id),
  PRIMARY KEY (parent_id, block_id)
);

CREATE TABLE page_sets (
  root_id uuid NOT NULL REFERENCES blocks (id),
  page_id uuid NOT NULL PRIMARY KEY REFERENCES blocks (id),
  lft integer NOT NULL CHECK (lft >= 1),
  rgt integer NOT NULL,
  CHECK (rgt > lft),
  UNIQUE (root_id, lft),
  UNIQUE (root_id, rgt)
);

-- migrate:down

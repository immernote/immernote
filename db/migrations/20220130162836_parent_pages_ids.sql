-- migrate:up
ALTER TABLE blocks
  ADD parent_pages_ids uuid[] DEFAULT '{}' NOT NULL;

-- migrate:down

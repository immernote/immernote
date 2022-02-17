-- migrate:up
CREATE TABLE page_blocks (
  page_id uuid NOT NULL REFERENCES blocks (id),
  block_id uuid NOT NULL REFERENCES blocks (id),
  PRIMARY KEY (page_id, block_id)
);

-- migrate:down

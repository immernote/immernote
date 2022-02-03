-- migrate:up
ALTER TABLE blocks
  DROP CONSTRAINT blocks_parent_block_id_fkey;

ALTER TABLE blocks
  ALTER parent_block_id TYPE uuid[]
  USING ARRAY[parent_block_id];

ALTER TABLE blocks
  ALTER parent_block_id SET DEFAULT '{}';

ALTER TABLE blocks
  ALTER parent_block_id SET NOT NULL;

-- migrate:down

-- migrate:up
DROP TYPE children_list;

CREATE DOMAIN children_list AS text;

-- migrate:down

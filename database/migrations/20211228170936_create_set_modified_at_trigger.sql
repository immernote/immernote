-- migrate:up
CREATE FUNCTION trigger_set_modified_at ()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
BEGIN
  NEW.modified_at = NOW();
  RETURN NEW;
END;
$$;

-- migrate:down

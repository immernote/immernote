-- name: HasSettingKeyValue :one
SELECT
  EXISTS (
    SELECT
      s.setting_key
    FROM
      public.instance_settings s
    WHERE
      s.setting_key = $1
      AND s.setting_value = $2
    LIMIT 1);

-- name: CreateInstanceSetting :exec
INSERT INTO public.instance_settings ("setting_key", "setting_value")
  VALUES (@setting_key, @setting_value);


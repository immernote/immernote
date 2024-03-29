// Code generated by sqlc. DO NOT EDIT.
// source: instance_settings.sql

package query

import (
	"context"
)

const createInstanceSetting = `-- name: CreateInstanceSetting :exec
INSERT INTO public.instance_settings ("setting_key", "setting_value")
  VALUES ($1, $2)
`

type CreateInstanceSettingParams struct {
	SettingKey   string `json:"setting_key"`
	SettingValue string `json:"setting_value"`
}

func (q *Queries) CreateInstanceSetting(ctx context.Context, arg CreateInstanceSettingParams) error {
	_, err := q.db.Exec(ctx, createInstanceSetting, arg.SettingKey, arg.SettingValue)
	return err
}

const hasSettingKeyValue = `-- name: HasSettingKeyValue :one
SELECT
  EXISTS (
    SELECT
      s.setting_key
    FROM
      public.instance_settings s
    WHERE
      s.setting_key = $1
      AND s.setting_value = $2
    LIMIT 1)
`

type HasSettingKeyValueParams struct {
	SettingKey   string `json:"setting_key"`
	SettingValue string `json:"setting_value"`
}

func (q *Queries) HasSettingKeyValue(ctx context.Context, arg HasSettingKeyValueParams) (bool, error) {
	row := q.db.QueryRow(ctx, hasSettingKeyValue, arg.SettingKey, arg.SettingValue)
	var exists bool
	err := row.Scan(&exists)
	return exists, err
}

// Code generated by sqlc. DO NOT EDIT.
// source: spaces.sql

package query

import (
	"context"

	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/types"
)

const createSpace = `-- name: CreateSpace :exec
INSERT INTO public.spaces ("id", "handle", "name", "icon", "settings", "domains")
  VALUES ($1, $2, $3, $4, $5, $6)
`

type CreateSpaceParams struct {
	ID       uuid.UUID           `json:"id"`
	Handle   string              `json:"handle"`
	Name     string              `json:"name"`
	Icon     types.SpaceIcon     `json:"icon"`
	Settings types.SpaceSettings `json:"settings"`
	Domains  []string            `json:"domains"`
}

func (q *Queries) CreateSpace(ctx context.Context, arg CreateSpaceParams) error {
	_, err := q.db.Exec(ctx, createSpace,
		arg.ID,
		arg.Handle,
		arg.Name,
		arg.Icon,
		arg.Settings,
		arg.Domains,
	)
	return err
}

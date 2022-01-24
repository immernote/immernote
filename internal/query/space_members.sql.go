// Code generated by sqlc. DO NOT EDIT.
// source: space_members.sql

package query

import (
	"context"

	"github.com/google/uuid"
)

const createSpaceMember = `-- name: CreateSpaceMember :exec
INSERT INTO public.space_members ("user_id", "space_id", "type")
  VALUES ($1, $2, $3)
`

type CreateSpaceMemberParams struct {
	UserID  uuid.UUID  `json:"user_id"`
	SpaceID uuid.UUID  `json:"space_id"`
	Type    MemberType `json:"type"`
}

func (q *Queries) CreateSpaceMember(ctx context.Context, arg CreateSpaceMemberParams) error {
	_, err := q.db.Exec(ctx, createSpaceMember, arg.UserID, arg.SpaceID, arg.Type)
	return err
}

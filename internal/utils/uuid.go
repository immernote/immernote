package utils

import (
	"github.com/google/uuid"
	"github.com/jackc/pgtype"
)

func ParseUUID(str string) (uuid.UUID, error) {
	if str == "" {
		return uuid.Nil, nil
	}

	return uuid.Parse(str)
}

func ParseNullableUUID(str string) (pgtype.UUID, error) {
	if str == "" {
		return pgtype.UUID{Status: pgtype.Null}, nil
	}

	id, err := uuid.Parse(str)
	if err != nil {
		return pgtype.UUID{}, err
	}

	return pgtype.UUID{Bytes: id, Status: pgtype.Present}, nil
}

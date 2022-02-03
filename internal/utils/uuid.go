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

func ParseUUIDList(ids_list []string) ([]uuid.UUID, error) {
	parsed := make([]uuid.UUID, len(ids_list))

	for index, item := range ids_list {
		if item == "" {
			parsed[index] = uuid.Nil
		} else {
			id, err := uuid.Parse(item)
			if err != nil {
				return parsed, err
			}

			parsed[index] = id
		}
	}

	return parsed, nil
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

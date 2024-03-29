package main

import (
	"context"
	"log"
	"strings"

	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/avatars"
	"github.com/immernote/immernote/internal/config"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
	"github.com/immernote/immernote/internal/types"
	"github.com/immernote/immernote/internal/utils"
)

func setup() {
	pq := query.New(database.Get())

	has_setting, err := pq.HasSettingKeyValue(context.Background(), query.HasSettingKeyValueParams{
		SettingKey:   "finished_setup",
		SettingValue: "TRUE",
	})
	if err != nil {
		panic(err)
	}

	if !has_setting {

		tx, err := database.Get().Begin(context.Background())
		if err != nil {
			tx.Rollback(context.Background())
			panic(err)
		}

		email := config.Get().ROOT_EMAIL
		if email == "" {
			panic("ROOT_EMAIL not provided")
		}

		log.Println("Setting up the root user using ", email)

		user_id, err := uuid.NewRandom()
		if err != nil {
			tx.Rollback(context.Background())
			panic(err)
		}

		if err := pq.WithTx(tx).CreateUserByID(context.Background(), query.CreateUserByIDParams{
			ID:       user_id,
			Email:    email,
			Name:     utils.EmailName(email),
			Avatar:   avatars.Get(email),
			Settings: map[string]string{},
		}); err != nil {
			tx.Rollback(context.Background())
			panic(err)
		}

		space_id, err := uuid.NewRandom()
		if err != nil {
			tx.Rollback(context.Background())
			panic(err)
		}

		if err := pq.WithTx(tx).CreateSpace(context.Background(), query.CreateSpaceParams{
			ID:     space_id,
			Handle: strings.ToLower(utils.EmailName(email)),
			Name:   utils.EmailName(email) + " Workspace",
			Icon: types.SpaceIcon{
				Type:    "emoji",
				Content: "🦄",
			},
			Settings: map[string]string{},
			Domains:  []string{},
		}); err != nil {
			tx.Rollback(context.Background())
			panic(err)
		}

		if err := pq.WithTx(tx).CreateSpaceMember(context.Background(), query.CreateSpaceMemberParams{
			UserID:  user_id,
			SpaceID: space_id,
			Type:    query.MemberTypeADMIN,
		}); err != nil {
			tx.Rollback(context.Background())
			panic(err)
		}

		if err := pq.WithTx(tx).CreateInstanceSetting(context.Background(), query.CreateInstanceSettingParams{
			SettingKey:   "finished_setup",
			SettingValue: "TRUE",
		}); err != nil {
			tx.Rollback(context.Background())
			panic(err)
		}

		if err := tx.Commit(context.Background()); err != nil {
			panic(err)
		}

		log.Println("Root user setup done")
	}
}

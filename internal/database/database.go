package database

import (
	"context"
	"fmt"
	"log"

	// "github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"

	"github.com/immernote/immernote/internal/config"
)

var database *pgxpool.Pool

var Ctx = context.Background()

func Get() *pgxpool.Pool {
	return database
}

func Init() *pgxpool.Pool {
	config := config.Get()
	connection_string := fmt.Sprintf("host=%s user=%s dbname=%s password=%s port=%d", config.PGHOST, config.PGUSER, config.PGDATABASE, config.PGPASSWORD, config.PGPORT)

	parsed_config, err := pgxpool.ParseConfig(connection_string)
	if err != nil {
		log.Fatal(err)
	}

	conn, err := pgxpool.ConnectConfig(context.Background(), parsed_config)
	if err != nil {
		log.Fatal(err)
	}

	database = conn

	return database
}

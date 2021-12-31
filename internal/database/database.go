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
	connectionString := fmt.Sprintf("host=%s user=%s dbname=%s password=%s port=%d", config.PGHOST, config.PGUSER, config.PGDATABASE, config.PGPASSWORD, config.PGPORT)

	parsedConfig, err := pgxpool.ParseConfig(connectionString)
	if err != nil {
		log.Fatal(err)
	}

	conn, err := pgxpool.ConnectConfig(context.Background(), parsedConfig)
	if err != nil {
		log.Fatal(err)
	}

	database = conn

	return database
}

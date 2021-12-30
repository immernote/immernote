package config

import (
	"fmt"
	"log"
	"os"
	"strconv"
)

type Config struct {
	IS_DEV bool
	PORT   int

	PGHOST     string
	PGUSER     string
	PGDATABASE string
	PGPASSWORD string
	PGPORT     int

	SMTP_HOST     string
	SMTP_PORT     int
	SMTP_SECURE   bool
	SMTP_USERNAME string
	SMTP_PASSWORD string

	STRIPE_SECRET_KEY     string
	STRIPE_WEBHOOK_SECRET string

	STRIPE_PRICES_YEARLY string

	COOKIE_SECRET string
	COOKIE_HOST   string
	COOKIE_SECURE bool

	SECRETS_KEY string

	HOST  string
	TAXER string

	AWS_ACCESS_KEY_ID     string
	AWS_SECRET_ACCESS_KEY string
	AWS_DEFAULT_REGION    string
}

var config Config

func Get() Config {
	return config
}

func Init() Config {
	PORT, err := strconv.Atoi(getEnv("PORT"))
	if err != nil {
		log.Fatal(err)
	}

	PGPORT, err := strconv.Atoi(getEnv("PGPORT"))
	if err != nil {
		log.Fatal(err)
	}

	SMTP_PORT, err := strconv.Atoi(getEnv("SMTP_PORT"))
	if err != nil {
		log.Fatal(err)
	}

	IS_DEV, err := strconv.ParseBool(getEnvDefault("IS_DEV", "false"))
	if err != nil {
		log.Fatal(err)
	}

	SMTP_SECURE, err := strconv.ParseBool(getEnv("SMTP_SECURE"))
	if err != nil {
		log.Fatal(err)
	}

	COOKIE_SECURE, err := strconv.ParseBool(getEnv("COOKIE_SECURE"))
	if err != nil {
		log.Fatal(err)
	}

	config = Config{
		IS_DEV: IS_DEV,
		PORT:   PORT,

		PGHOST:     getEnv("PGHOST"),
		PGUSER:     getEnv("PGUSER"),
		PGDATABASE: getEnv("PGDATABASE"),
		PGPASSWORD: getEnv("PGPASSWORD"),
		PGPORT:     PGPORT,

		SMTP_HOST:     getEnv("SMTP_HOST"),
		SMTP_PORT:     SMTP_PORT,
		SMTP_SECURE:   SMTP_SECURE,
		SMTP_USERNAME: getEnv("SMTP_USERNAME"),
		SMTP_PASSWORD: getEnv("SMTP_PASSWORD"),

		STRIPE_SECRET_KEY:     getEnv("STRIPE_SECRET_KEY"),
		STRIPE_WEBHOOK_SECRET: getEnv("STRIPE_WEBHOOK_SECRET"),

		STRIPE_PRICES_YEARLY: getEnv("STRIPE_PRICES_YEARLY"),

		COOKIE_SECRET: getEnv("COOKIE_SECRET"),
		COOKIE_HOST:   getEnv("COOKIE_HOST"),
		COOKIE_SECURE: COOKIE_SECURE,

		SECRETS_KEY: getEnv("SECRETS_KEY"),

		HOST:  getEnv("HOST"),
		TAXER: getEnv("TAXER"),

		AWS_ACCESS_KEY_ID:     getEnv("AWS_ACCESS_KEY_ID"),
		AWS_SECRET_ACCESS_KEY: getEnv("AWS_SECRET_ACCESS_KEY"),
		AWS_DEFAULT_REGION:    getEnv("AWS_DEFAULT_REGION"),
	}

	return config
}

func getEnv(str string) string {
	env, ok := os.LookupEnv(str)
	if !ok {
		log.Fatal(fmt.Sprintf("%s environment variable required but not set", str))
	}

	return env
}

func getEnvDefault(str string, fallback string) string {
	env, ok := os.LookupEnv(str)
	if !ok || len(env) == 0 {
		return fallback
	}

	return env
}

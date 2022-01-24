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

	COOKIE_SECRET string
	COOKIE_HOST   string
	COOKIE_SECURE bool

	WEB_HOST string

	AWS_ACCESS_KEY_ID     string
	AWS_SECRET_ACCESS_KEY string
	AWS_DEFAULT_REGION    string

	ROOT_EMAIL string
}

var config Config

func Get() Config {
	return config
}

func Init() Config {
	PORT, err := strconv.Atoi(get_env("PORT"))
	if err != nil {
		log.Fatal(err)
	}

	PGPORT, err := strconv.Atoi(get_env("PGPORT"))
	if err != nil {
		log.Fatal(err)
	}

	SMTP_PORT, err := strconv.Atoi(get_env("SMTP_PORT"))
	if err != nil {
		log.Fatal(err)
	}

	IS_DEV, err := strconv.ParseBool(get_env_default("IS_DEV", "false"))
	if err != nil {
		log.Fatal(err)
	}

	SMTP_SECURE, err := strconv.ParseBool(get_env("SMTP_SECURE"))
	if err != nil {
		log.Fatal(err)
	}

	COOKIE_SECURE, err := strconv.ParseBool(get_env("COOKIE_SECURE"))
	if err != nil {
		log.Fatal(err)
	}

	config = Config{
		IS_DEV: IS_DEV,
		PORT:   PORT,

		PGHOST:     get_env("PGHOST"),
		PGUSER:     get_env("PGUSER"),
		PGDATABASE: get_env("PGDATABASE"),
		PGPASSWORD: get_env("PGPASSWORD"),
		PGPORT:     PGPORT,

		SMTP_HOST:     get_env("SMTP_HOST"),
		SMTP_PORT:     SMTP_PORT,
		SMTP_SECURE:   SMTP_SECURE,
		SMTP_USERNAME: get_env("SMTP_USERNAME"),
		SMTP_PASSWORD: get_env("SMTP_PASSWORD"),

		COOKIE_SECRET: get_env("COOKIE_SECRET"),
		COOKIE_HOST:   get_env("COOKIE_HOST"),
		COOKIE_SECURE: COOKIE_SECURE,

		WEB_HOST: get_env("WEB_HOST"),

		AWS_ACCESS_KEY_ID:     get_env("AWS_ACCESS_KEY_ID"),
		AWS_SECRET_ACCESS_KEY: get_env("AWS_SECRET_ACCESS_KEY"),
		AWS_DEFAULT_REGION:    get_env("AWS_DEFAULT_REGION"),

		ROOT_EMAIL: get_env("ROOT_EMAIL"),
	}

	return config
}

func get_env(str string) string {
	env, ok := os.LookupEnv(str)
	if !ok {
		log.Fatal(fmt.Sprintf("%s environment variable required but not set", str))
	}

	return env
}

func get_env_default(str string, fallback string) string {
	env, ok := os.LookupEnv(str)
	if !ok || len(env) == 0 {
		return fallback
	}

	return env
}

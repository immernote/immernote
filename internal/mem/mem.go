package mem

import (
	"context"
	"fmt"

	"github.com/go-redis/redis/v8"
	"github.com/immernote/immernote/internal/config"
)

var rd *redis.Client

var Ctx = context.Background()

func Get() *redis.Client {
	return rd
}

func Init() *redis.Client {
	config := config.Get()

	rd = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", config.REDIS_HOST, config.REDIS_PORT),
		Password: config.REDIS_PASSWORD,
		DB:       0, // use default DB
	})

	return rd
}

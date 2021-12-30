package main

import (
	"github.com/immernote/immernote/internal/config"
	"github.com/immernote/immernote/internal/migrate"
	"github.com/immernote/immernote/internal/router"
)

func main() {
	config.Init()

	migrate.Exec()

	router.RegisterRoutes()
}

package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/immernote/immernote/internal/config"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/mem"
	"github.com/immernote/immernote/internal/migrate"
	"github.com/immernote/immernote/internal/router"
)

func main() {
	config.Init()

	migrate.Exec()

	db := database.Init()
	defer db.Close()

	rd := mem.Init()
	defer rd.Close()

	setup()

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(cors.Default())

	router.RegisterRoutes(r)

	log.Println("api starting on ", config.Get().PORT)

	srv := &http.Server{
		Addr:    ":" + strconv.Itoa(config.Get().PORT),
		Handler: r,
	}

	// Initializing the server in a goroutine so that
	// it won't block the graceful shutdown handling below
	go func() {
		if err := srv.ListenAndServe(); err != nil && errors.Is(err, http.ErrServerClosed) {
			log.Printf("listen: %s\n", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal, 1)
	// kill (no param) default send syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall.SIGKILL but can't be catch, so don't need add it
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// The context is used to inform the server it has 5 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")

	log.Println("API READY ON PORT", config.Get().PORT)
}

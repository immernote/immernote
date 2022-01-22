package router

import (
	"github.com/gin-gonic/gin"
	"github.com/immernote/immernote/internal/config"
	"github.com/immernote/immernote/internal/middleware"
	"github.com/immernote/immernote/internal/token"
	"github.com/julienschmidt/httprouter"
)

type Router struct {
	r *httprouter.Router
}

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		v0 := api.Group("/v0")
		{
			v0.GET("/ok", withJson(Health))

			v0.POST("/login", withJson(Login))
			v0.POST("/confirm", withJson(Confirm))

			v0.GET("/users", middleware.Auth(), withJson(GetUserByCookie))

			v0.GET("/spaces", middleware.Auth(), withJson(ListSpaces))
		}
		// Login
		// Create workspace
		// Auth with JWT and multiple emails
		// Get user
		// Get workspace
	}

	if config.Get().IS_DEV {
		r.NoRoute(middleware.Proxy("http://web:3000"))
	} else {
		r.Use(middleware.Spa("/", "./dist"))
	}
}

func Health(
	c *gin.Context,
) (int, interface{}, error) {
	tkn, _ := token.New("AAAAAA")
	return 200, gin.H{"ok": true, "token": tkn}, nil
}

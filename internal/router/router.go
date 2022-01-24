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
			v0.GET("/ok", with_json(Health))

			v0.POST("/login", with_json(Login))
			v0.POST("/confirm", with_json(Confirm))

			v0.GET("/users", middleware.Auth(), with_json(GetUserByCookie))

			v0.GET("/spaces", middleware.Auth(), with_json(ListSpaces))

			v0.GET("/blocks", middleware.Auth(), with_json(ListBlocks))
			v0.POST("/blocks/pages", middleware.Auth(), with_json(CreatePageBlock))
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

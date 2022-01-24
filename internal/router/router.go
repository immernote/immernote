package router

import (
	"github.com/gin-gonic/gin"
	"github.com/immernote/immernote/internal/token"
	"github.com/julienschmidt/httprouter"
)

type Router struct {
	r *httprouter.Router
}

func RegisterRoutes(r *gin.Engine) {
	v0 := r.Group("/v0")
	{
		v0.GET("/ok", withJson(Health))

		v0.POST("/login", withJson(Login))
	}
	// Login
	// Create workspace
	// Auth with JWT and multiple emails
	// Get user
	// Get workspace
}

func Health(
	c *gin.Context,
) (int, interface{}, error) {
	tkn, _ := token.New("AAAAAA")
	return 200, gin.H{"ok": true, "token": tkn}, nil
}

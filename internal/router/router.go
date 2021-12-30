package router

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type Router struct {
	r *httprouter.Router
}

func RegisterRoutes() {
	router := httprouter.New()
	router.PanicHandler = handlePanic

	router.GET("/", withJson(Health))
	// Login
	// Create workspace
	// Auth with JWT and multiple emails
	// Get user
	// Get workspace
}

func Health(
	w http.ResponseWriter,
	r *http.Request,
	_ httprouter.Params,
) (int, interface{}, error) {
	return 200, H{"ok": true}, nil
}

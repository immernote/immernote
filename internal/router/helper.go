package router

import (
	"log"
	"net/http"
	"runtime/debug"

	"github.com/goccy/go-json"
	"github.com/julienschmidt/httprouter"
)

// H is a map helper
type H map[string]interface{}

// withJson is an error boundry and JSON converter for handles
func withJson(fn func(http.ResponseWriter, *http.Request, httprouter.Params) (int, interface{}, error)) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		status, data, err := fn(w, r, p)
		if err != nil {
			toJson(w, H{"error": err.Error()}, status)
			return
		}

		toJson(w, data, status)
	}
}

// toJson returns a JSON response with a status
func toJson(w http.ResponseWriter, data interface{}, status int) {
	resp, err := json.Marshal(data)
	if err != nil {
		panic("toJson() marshall error " + err.Error())
	}

	w.WriteHeader(status)
	w.Header().Set("Content-Type", "application/json")
	w.Write(resp)
}

// handlePanic is the PanicHandler for httprouter
func handlePanic(w http.ResponseWriter, r *http.Request, err interface{}) {
	log.Println(r.URL.Path, string(debug.Stack())) // Collecting panic trace
	w.WriteHeader(http.StatusInternalServerError)
}

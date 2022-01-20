package middleware

import (
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
)

func Proxy(target string) gin.HandlerFunc {
	return func(c *gin.Context) {
		remote, err := url.Parse(target)
		if err != nil {
			panic(err)
		}

		proxy := httputil.NewSingleHostReverseProxy(remote)
		// Define the director func
		// This is a good place to log, for example
		proxy.Director = func(req *http.Request) {
			req.Header = c.Request.Header
			req.Host = remote.Host
			req.URL.Scheme = remote.Scheme
			req.URL.Host = remote.Host
			req.URL.Path = c.Request.URL.Path
			if remote.RawQuery == "" || req.URL.RawQuery == "" {
				req.URL.RawQuery = remote.RawQuery + req.URL.RawQuery
			} else {
				req.URL.RawQuery = remote.RawQuery + "&" + req.URL.RawQuery
			}
		}

		proxy.ServeHTTP(c.Writer, c.Request)

		// c.Next()
	}
}

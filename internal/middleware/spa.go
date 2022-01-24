package middleware

import (
	"net/http"
	"path/filepath"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func Spa(url_prefix, spa_directory string) gin.HandlerFunc {
	directory := static.LocalFile(spa_directory, true)
	fileserver := http.FileServer(directory)
	if url_prefix != "" {
		fileserver = http.StripPrefix(url_prefix, fileserver)
	}
	return func(c *gin.Context) {
		if directory.Exists(url_prefix, c.Request.URL.Path) {
			ext := filepath.Ext(c.Request.URL.Path)
			if ext == "js" || ext == "css" || ext == "png" || ext == "ico" || ext == "woff2" || ext == "woff" {
				c.Header("Cache-Control", "public, max-age=31536000")
			}

			fileserver.ServeHTTP(c.Writer, c.Request)
			c.Abort()
		} else {
			c.Request.URL.Path = "/"
			fileserver.ServeHTTP(c.Writer, c.Request)
			c.Abort()
		}
	}
}

package router

import (
	"github.com/gin-gonic/gin"
)

// withJson is an error boundry and JSON converter for handles
func withJson(fn func(*gin.Context) (int, interface{}, error)) gin.HandlerFunc {
	return func(c *gin.Context) {
		status, data, err := fn(c)
		if err != nil {
			c.AbortWithStatusJSON(status, gin.H{"error": err.Error()})
			return
		}

		c.JSON(status, data)
	}
}

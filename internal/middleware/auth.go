package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/token"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		token_cookie, err := c.Cookie("immernote_token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, "User not found")
			return
		}

		if len(token_cookie) == 0 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, "User not found")
			return
		}

		parsed_token, err := token.Decrypt(token_cookie)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
			return
		}

		user_id, err := uuid.Parse(parsed_token.Get("id"))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
			return
		}

		c.Set("user_id", user_id)

		c.Next()
	}
}

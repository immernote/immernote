package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/token"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenCookie, err := c.Cookie("immernote_token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, "User not found")
			return
		}

		if len(tokenCookie) == 0 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, "User not found")
			return
		}

		parsedToken, err := token.Decrypt(tokenCookie)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
			return
		}

		userID, err := uuid.Parse(parsedToken.Get("id"))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
			return
		}

		c.Set("userID", userID)

		c.Next()
	}
}

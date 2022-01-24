package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
)

func GetUserByCookie(c *gin.Context) (int, interface{}, error) {
	pq := query.New(database.Get())

	user, err := pq.GetUserByID(c.Request.Context(), c.MustGet("user_id").(uuid.UUID))
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	return 200, user, nil
}

package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
)

func ListSpaces(c *gin.Context) (int, interface{}, error) {
	pq := query.New(database.Get())

	spaces, err := pq.ListSpacesByUserID(c.Request.Context(), c.MustGet("userID").(uuid.UUID))
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	return 200, spaces, nil
}

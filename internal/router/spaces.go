package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
)

type list_spaces_query struct {
	ID     string `form:"id"`
	Handle string `form:"handle"`
}

func ListSpaces(c *gin.Context) (int, interface{}, error) {
	qs := new(list_spaces_query)

	if err := c.BindQuery(qs); err != nil {
		return http.StatusBadRequest, nil, err
	}

	pq := query.New(database.Get())

	switch true {
	case qs.Handle != "":
		spaces, err := pq.GetSpaceByHandle(c.Request.Context(), qs.Handle)
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		return 200, spaces, nil
	default:
		spaces, err := pq.ListSpacesByUserID(c.Request.Context(), c.MustGet("user_id").(uuid.UUID))
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		return 200, spaces, nil

	}
}

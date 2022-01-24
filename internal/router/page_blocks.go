package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
)

type list_page_blocks_query struct {
	SpaceHandle string `form:"space_handle"`
}

func ListPageBlocks(c *gin.Context) (int, interface{}, error) {
	qs := new(list_page_blocks_query)

	if err := c.BindQuery(qs); err != nil {
		return http.StatusBadRequest, nil, err
	}

	pq := query.New(database.Get())

	switch true {
	case qs.SpaceHandle != "":
		blocks, err := pq.ListPageBlocksBySpaceHandle(c.Request.Context(), qs.SpaceHandle)
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		return 200, blocks, nil
	default:

		return http.StatusNotFound, nil, nil

	}
}

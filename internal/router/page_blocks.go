package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
	"github.com/jackc/pgtype"
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

type create_page_block_body struct {
	ID uuid.UUID `json:"id" binding:"required"`
	// Rank          string      `json:"rank"`
	Content       string      `json:"content" binding:"required"`
	Format        string      `json:"format" binding:"required"`
	ParentBlockID pgtype.UUID `json:"parent_block_id"`
	ParentPageID  pgtype.UUID `json:"parent_page_id"`
	SpaceID       uuid.UUID   `json:"space_id" binding:"required"`
}

func CreatePageBlock(c *gin.Context) (int, interface{}, error) {
	body := new(create_page_block_body)

	if err := c.BindJSON(body); err != nil {
		return http.StatusBadRequest, nil, err
	}

	pq := query.New(database.Get())

	block, err := pq.CreatePageBlock(c.Request.Context(), query.CreatePageBlockParams{
		ID:            body.ID,
		SpaceID:       body.SpaceID,
		ParentPageID:  body.ParentPageID,
		ParentBlockID: body.ParentBlockID,
		Content:       body.Content,
		Format:        body.Format,
		CreatedBy:     c.MustGet("user_id").(uuid.UUID),
	})
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	return 200, block, nil
}

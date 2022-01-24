package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
	"github.com/immernote/immernote/internal/types"
	"github.com/jackc/pgtype"
)

type list_blocks_query struct {
	Type         string    `form:"type" binding:"required"`
	SpaceHandle  string    `form:"space_handle" binding:"required_without=SpaceID"`
	SpaceID      uuid.UUID `form:"space_id" binding:"required_without=SpaceHandle"`
	ParentPageID uuid.UUID `form:"parent_page_id"`
}

func ListBlocks(c *gin.Context) (int, interface{}, error) {
	qs := new(list_blocks_query)

	if err := c.BindQuery(qs); err != nil {
		return http.StatusBadRequest, nil, err
	}

	pq := query.New(database.Get())

	blocks, err := pq.ListBlocks(c.Request.Context(), query.ListBlocksParams{
		Type:         qs.Type,
		SpaceHandle:  qs.SpaceHandle,
		SpaceID:      qs.SpaceID,
		ParentPageID: qs.ParentPageID,
	})
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	return 200, blocks, nil
}

type create_page_block_body struct {
	ID uuid.UUID `json:"id" binding:"required"`
	// Rank          string      `json:"rank"`
	Content       types.Map   `json:"content" binding:"required"`
	Format        types.Map   `json:"format" binding:"required"`
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

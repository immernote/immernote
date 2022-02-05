package router

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/action"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
	"github.com/immernote/immernote/internal/types"
	"github.com/immernote/immernote/internal/utils"
	"github.com/jackc/pgtype"
)

func ListBlocks(c *gin.Context) (int, interface{}, error) {
	qs := new(struct {
		Type        string `form:"type"`
		SpaceHandle string `form:"space_handle" binding:"required_without=SpaceID"`
		SpaceID     string `form:"space_id" binding:"required_without=SpaceHandle"`
		PageID      string `form:"page_id"`
		ParentID    string `form:"parent_id"`
	})

	if err := c.BindQuery(qs); err != nil {
		return http.StatusBadRequest, nil, err
	}

	blocks, err := action.ListBlocks(action.ListBlocksParams{
		Type:        qs.Type,
		ParentID:    qs.ParentID,
		PageID:      qs.PageID,
		SpaceID:     qs.SpaceID,
		SpaceHandle: qs.SpaceHandle,
		Ctx:         c.Request.Context(),
	})
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	return 200, blocks, nil
}

/* ---------------------------------------------------------------------------------------------- */

func GetBlock(c *gin.Context) (int, interface{}, error) {
	qs := new(struct {
		ID string `form:"id" binding:"required"`
	})

	if err := c.BindQuery(qs); err != nil {
		return http.StatusBadRequest, nil, err
	}

	block, err := action.GetBlock(action.GetBlockParams{
		ID:  qs.ID,
		Ctx: c.Request.Context(),
	})
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	return 200, block, nil
}

/* ---------------------------------------------------------------------------------------------- */

type create_page_block_body struct {
	ID            uuid.UUID   `json:"id" binding:"required"`
	Content       types.Map   `json:"content" binding:"required"`
	Format        types.Map   `json:"format" binding:"required"`
	ParentBlockID []uuid.UUID `json:"parent_block_id"`
	ParentPageID  pgtype.UUID `json:"parent_page_id"`
	SpaceID       uuid.UUID   `json:"space_id" binding:"required"`
}

func CreatePageBlock(c *gin.Context) (int, interface{}, error) {
	body := new(create_page_block_body)

	if err := c.BindJSON(body); err != nil {
		return http.StatusBadRequest, nil, err
	}

	pq := query.New(database.Get())

	block, err := pq.CreateBlock(c.Request.Context(), query.CreateBlockParams{
		Type:          "page",
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

/* ---------------------------------------------------------------------------------------------- */

type create_paragraph_block_body struct {
	ID             string    `json:"id" binding:"required"`
	Content        types.Map `json:"content" binding:"required"`
	Format         types.Map `json:"format" binding:"required"`
	ParentBlockID  []string  `json:"parent_block_id"`
	ParentPageID   string    `json:"parent_page_id"`
	ParentPagesIDs []string  `json:"parent_pages_ids" binding:"required"`
	SpaceID        string    `json:"space_id" binding:"required"`
}

func CreateParagraphBlock(c *gin.Context) (int, interface{}, error) {
	body := new(create_paragraph_block_body)

	if err := c.BindJSON(body); err != nil {
		return http.StatusBadRequest, nil, err
	}

	pq := query.New(database.Get())

	id, err := uuid.Parse(body.ID)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	space_id, err := uuid.Parse(body.SpaceID)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	parent_page_id, err := utils.ParseNullableUUID(body.ParentPageID)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	parent_block_id, err := utils.ParseUUIDList(body.ParentBlockID)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	parent_pages_ids := make([]uuid.UUID, len(body.ParentPagesIDs))
	for index, str_id := range body.ParentPagesIDs {
		parsed_uuid, err := uuid.Parse(str_id)
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		parent_pages_ids[index] = parsed_uuid
	}

	block, err := pq.CreateBlock(c.Request.Context(), query.CreateBlockParams{
		Type:           "paragraph",
		ID:             id,
		SpaceID:        space_id,
		ParentPageID:   parent_page_id,
		ParentPagesIds: parent_pages_ids,
		ParentBlockID:  parent_block_id,
		Content:        body.Content,
		Format:         body.Format,
		CreatedBy:      c.MustGet("user_id").(uuid.UUID),
	})
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	return 200, block, nil
}

/* ---------------------------------------------------------------------------------------------- */

type update_block_content_body struct {
	ID      string    `json:"id" binding:"required"`
	Content types.Map `json:"content" binding:"required"`
}

func UpdateBlockContent(c *gin.Context) (int, interface{}, error) {
	body := new(update_block_content_body)

	if err := c.BindJSON(body); err != nil {
		return http.StatusBadRequest, nil, err
	}

	pq := query.New(database.Get())

	id, err := uuid.Parse(body.ID)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	block, err := pq.UpdateBlockContent(c.Request.Context(), query.UpdateBlockContentParams{
		ID:      id,
		Content: body.Content,
	})
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	return 200, block, nil
}

/* ---------------------------------------------------------------------------------------------- */

type ByRank []query.Block

func (a ByRank) Len() int { return len(a) }
func (a ByRank) Less(i, j int) bool {
	ai, _ := strconv.ParseFloat(a[i].Rank, 64)
	aj, _ := strconv.ParseFloat(a[i].Rank, 64)

	return ai < aj
}
func (a ByRank) Swap(i, j int) { a[i], a[j] = a[j], a[i] }

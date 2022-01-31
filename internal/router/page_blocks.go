package router

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
	"github.com/immernote/immernote/internal/types"
	"github.com/immernote/immernote/internal/utils"
	"github.com/jackc/pgtype"
)

type list_blocks_query struct {
	Type         string `form:"type"`
	SpaceHandle  string `form:"space_handle" binding:"required_without=SpaceID"`
	SpaceID      string `form:"space_id" binding:"required_without=SpaceHandle"`
	ParentPageID string `form:"parent_page_id"`
}

func ListBlocks(c *gin.Context) (int, interface{}, error) {
	qs := new(list_blocks_query)

	if err := c.BindQuery(qs); err != nil {
		return http.StatusBadRequest, nil, err
	}

	pq := query.New(database.Get())

	switch true {
	case qs.SpaceHandle != "" && qs.ParentPageID == "":
		blocks, err := pq.ListBlocksByTypeSpaceHandleNullParentPageID(c.Request.Context(), query.ListBlocksByTypeSpaceHandleNullParentPageIDParams{
			Type:        qs.Type,
			SpaceHandle: qs.SpaceHandle,
		})
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		return 200, blocks, nil

	case qs.SpaceID != "" && qs.ParentPageID == "":
		space_id, err := uuid.Parse(qs.SpaceID)
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		blocks, err := pq.ListBlocksByTypeSpaceIDNullParentPageID(c.Request.Context(), query.ListBlocksByTypeSpaceIDNullParentPageIDParams{
			Type:    qs.Type,
			SpaceID: space_id,
		})
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		return 200, blocks, nil

	case qs.SpaceHandle != "" && qs.ParentPageID != "":
		parent_page_id, err := uuid.Parse(qs.ParentPageID)
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		blocks, err := pq.ListBlocksByTypeSpaceHandleParentPageID(c.Request.Context(), query.ListBlocksByTypeSpaceHandleParentPageIDParams{
			Type:         qs.Type,
			SpaceHandle:  qs.SpaceHandle,
			ParentPageID: parent_page_id,
		})
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		return 200, blocks, nil

	case qs.SpaceID != "" && qs.ParentPageID != "":
		space_id, err := uuid.Parse(qs.SpaceID)
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		parent_page_id, err := uuid.Parse(qs.ParentPageID)
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		blocks, err := pq.ListBlocksByTypeSpaceIDParentPageID(c.Request.Context(), query.ListBlocksByTypeSpaceIDParentPageIDParams{
			Type:         qs.Type,
			SpaceID:      space_id,
			ParentPageID: parent_page_id,
		})
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		return 200, blocks, nil

	default:
		return http.StatusBadRequest, nil, nil
	}
}

type get_block_query struct {
	ID string `form:"id" binding:"required"`
}

func GetBlock(c *gin.Context) (int, interface{}, error) {
	qs := new(get_block_query)

	if err := c.BindQuery(qs); err != nil {
		return http.StatusBadRequest, nil, err
	}

	pq := query.New(database.Get())

	switch {
	case qs.ID != "":
		block_id, err := uuid.Parse(qs.ID)
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		block, err := pq.GetBlockByID(c.Request.Context(), block_id)
		if err != nil {
			return http.StatusInternalServerError, nil, err
		}

		return 200, block, nil

	default:
		return http.StatusBadRequest, nil, nil
	}
}

type create_page_block_body struct {
	ID            uuid.UUID   `json:"id" binding:"required"`
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

type create_paragraph_block_body struct {
	ID             string    `json:"id" binding:"required"`
	Content        types.Map `json:"content" binding:"required"`
	Format         types.Map `json:"format" binding:"required"`
	ParentBlockID  string    `json:"parent_block_id"`
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

	log.Println(body)

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

	parent_block_id, err := utils.ParseNullableUUID(body.ParentBlockID)
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

type ByRank []query.Block

func (a ByRank) Len() int { return len(a) }
func (a ByRank) Less(i, j int) bool {
	ai, _ := strconv.ParseFloat(a[i].Rank, 64)
	aj, _ := strconv.ParseFloat(a[i].Rank, 64)

	return ai < aj
}
func (a ByRank) Swap(i, j int) { a[i], a[j] = a[j], a[i] }

package router

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/immernote/immernote/internal/cookie"
	"github.com/immernote/immernote/internal/database"
	"github.com/immernote/immernote/internal/query"
	"github.com/immernote/immernote/internal/token"
	"github.com/immernote/immernote/internal/transactional"
	"github.com/immernote/immernote/internal/utils"
	"github.com/jackc/pgtype"
	gonanoid "github.com/matoous/go-nanoid/v2"
)

func Login(c *gin.Context) (int, interface{}, error) {
	body := new(struct {
		Email string `json:"email" binding:"required"`
	})

	if err := c.BindJSON(body); err != nil {
		return http.StatusBadRequest, nil, err
	}

	pq := query.New(database.Get())

	hasUser, err := pq.HasUserByEmail(context.Background(), body.Email)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	if !hasUser {
		return http.StatusNotFound, nil, errors.New("user not found")
	}

	user, err := pq.GetUserByEmail(context.Background(), body.Email)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	token, err := gonanoid.New()
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	if _, err := pq.UpdateUserConfirmationTokenByID(context.Background(), query.UpdateUserConfirmationTokenByIDParams{
		ConfirmationToken: pgtype.Text{String: token, Status: pgtype.Present},
		ID:                user.ID,
	}); err != nil {
		return http.StatusInternalServerError, nil, err
	}

	if err := transactional.Send(
		"Login to ImmerNote",
		body.Email,
		utils.CreateLoginTemplate(token, user.ID.String(), true),
		utils.CreateLoginTemplate(token, user.ID.String(), false),
	); err != nil {
		return http.StatusInternalServerError, nil, err
	}

	return 200, user, nil
}

func Confirm(c *gin.Context) (int, interface{}, error) {
	body := new(struct {
		Token  string `json:"token" validate:"required"`
		UserID string `json:"userID" validate:"required"`
	})

	if err := c.BindJSON(body); err != nil {
		return http.StatusBadRequest, nil, err
	}

	userID, err := uuid.Parse(body.UserID)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	pq := query.New(database.Get())

	hasValidToken, err := pq.HasValidConfirmationTokenByUserID(c.Request.Context(), userID)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	if !hasValidToken {
		return http.StatusNotFound, nil, errors.New("user not found")
	}

	user, err := pq.UpdateUserConfirmedAtByID(c.Request.Context(), userID)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	accessToken, err := token.New(body.UserID)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	cookie.Auth(c, accessToken)

	return 200, user, nil
}

package cookie

import (
	"github.com/gin-gonic/gin"
	"github.com/immernote/immernote/internal/config"
)

func Auth(ctx *gin.Context, token string) {
	ctx.SetCookie(
		"immernote_token",
		token,
		365*24*3600,
		"/",
		config.Get().COOKIE_HOST,
		config.Get().COOKIE_SECURE,
		true,
	)

	ctx.SetCookie(
		"immernote_authed",
		"true",
		365*24*3600,
		"/",
		config.Get().COOKIE_HOST,
		config.Get().COOKIE_SECURE,
		false,
	)
}

func Unauth(ctx *gin.Context) {
	ctx.SetCookie(
		"immernote_token",
		"",
		0,
		"/",
		config.Get().COOKIE_HOST,
		config.Get().COOKIE_SECURE,
		true,
	)

	ctx.SetCookie(
		"immernote_authed",
		"false",
		0,
		"/",
		config.Get().COOKIE_HOST,
		config.Get().COOKIE_SECURE,
		false,
	)
}

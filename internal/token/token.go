package token

import (
	"time"

	"github.com/immernote/immernote/internal/config"
	"github.com/o1egl/paseto"
)

func New(uuid string) (string, error) {
	symmetric_key := []byte(config.Get().COOKIE_SECRET) // Must be 32 bytes
	now := time.Now()
	exp := now.Add(365 * 24 * time.Hour)
	nbt := now

	json_token := paseto.JSONToken{
		// Audience:   "test",
		// Issuer:     "test_service",
		// Jti:        "123",
		// Subject:    "test_subject",
		IssuedAt:   now,
		Expiration: exp,
		NotBefore:  nbt,
	}

	// Add custom claim to the token
	json_token.Set("id", uuid)

	// Encrypt data
	token, err := paseto.NewV2().Encrypt(symmetric_key, json_token, nil)
	if err != nil {
		return token, err
	}

	return token, nil
}

func Decrypt(token string) (paseto.JSONToken, error) {
	symmetric_key := []byte(config.Get().COOKIE_SECRET)

	var new_json_token paseto.JSONToken
	if err := paseto.NewV2().Decrypt(token, symmetric_key, &new_json_token, nil); err != nil {
		return new_json_token, err
	}

	return new_json_token, nil
}

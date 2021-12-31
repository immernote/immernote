package token

import (
	"time"

	"github.com/immernote/immernote/internal/config"
	"github.com/o1egl/paseto"
)

func New(uuid string) (string, error) {
	symmetricKey := []byte(config.Get().COOKIE_SECRET) // Must be 32 bytes
	now := time.Now()
	exp := now.Add(365 * 24 * time.Hour)
	nbt := now

	jsonToken := paseto.JSONToken{
		// Audience:   "test",
		// Issuer:     "test_service",
		// Jti:        "123",
		// Subject:    "test_subject",
		IssuedAt:   now,
		Expiration: exp,
		NotBefore:  nbt,
	}

	// Add custom claim to the token
	jsonToken.Set("id", uuid)

	// Encrypt data
	token, err := paseto.NewV2().Encrypt(symmetricKey, jsonToken, nil)
	if err != nil {
		return token, err
	}

	return token, nil
}

func Decrypt(token string) (paseto.JSONToken, error) {
	symmetricKey := []byte(config.Get().COOKIE_SECRET)

	var newJsonToken paseto.JSONToken
	if err := paseto.NewV2().Decrypt(token, symmetricKey, &newJsonToken, nil); err != nil {
		return newJsonToken, err
	}

	return newJsonToken, nil
}

package utils

import gonanoid "github.com/matoous/go-nanoid/v2"

func Nanoid(l int) (string, error) {
	return gonanoid.Generate("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", l)
}

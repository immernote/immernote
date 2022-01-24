package avatars

import (
	"crypto/md5"
	"fmt"
	"strings"
)

func Get(email string) string {
	return "http://www.gravatar.com/avatar/" + hash(email) + "?d=mp"
}

func hash(email string) string {
	email = strings.ToLower(strings.TrimSpace(email))
	hash := md5.New()
	hash.Write([]byte(email))
	return fmt.Sprintf("%x", hash.Sum(nil))
}

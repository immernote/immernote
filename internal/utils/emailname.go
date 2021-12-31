package utils

import "strings"

func EmailName(email string) string {
	s := strings.Split(email, "@")

	if s[0] == "hello" || s[0] == "hey" {
		p := strings.Split(s[1], ".")
		return p[0]
	} else {
		return s[0]
	}
}
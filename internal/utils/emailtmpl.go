package utils

import (
	"fmt"

	"github.com/immernote/immernote/internal/config"
)

func CreateLoginTemplate(token string, user_id string, raw bool) string {
	host := config.Get().WEB_HOST

	if raw {
		return fmt.Sprintf(`Hi there! It's ImmerNote.
		Please copy and paste this link into your browser to confirm that you want to log in. This link will expire in fifteen minutes and can only be used once.
		%s/confirm?token=%s&user_id=%s`, host, token, user_id)
	} else {
		return fmt.Sprintf(`<div style="text-align:center; max-width: 600px; margin: 2rem auto;">
		<h1 style="font-family: Inter, system-ui, sans-erif; letter-spacing: -0.02em; font-size:2.5rem; margin: 0; padding: 0; line-height: 1.1;">ImmerNote</h1>
		<p style="font-family: Inter, system-ui, sans-erif; font-size: 1rem; padding-bottom: .75rem; line-height: 1.45;">Click and confirm that you want to log in to ImmerNote. This link will expire in fifteen minutes and can only be used once.</p>
		<a href="%s/confirm?token=%s&user_id=%s" style="background-color: #0070f3; text-decoration: none; color: #fff;font-family: Inter, system-ui, sans-erif; font-size: 1rem; letter-spacing: -0.01em; font-weight: 600; font-size: 1.25rem; padding: 1rem 2rem; border-radius: 4px; display: block; width: 12rem; margin: 0 auto;">Log in to ImmerNote</a>
	</div>`, host, token, user_id)
	}
}

func CreateInvitationTemplate(inviter, space, email string, raw bool) string {
	host := config.Get().WEB_HOST

	link := fmt.Sprintf(
		"%s/login?email=%s&type=invitation",
		host, email,
	)

	if raw {
		return fmt.Sprintf(`Hi there! %s invited you to %s on ImmerNote.
		Please copy and paste this link into your browser to log in.
		%s`, inviter, space, link)
	} else {
		return fmt.Sprintf(`<div style="text-align:center; max-width: 600px; margin: 2rem auto;">
		<h1 style="font-family: Inter, system-ui, sans-erif; letter-spacing: -0.02em; font-size:2.5rem; margin: 0; padding: 0; line-height: 1.1;">ImmerNote</h1>
		<p style="font-family: Inter, system-ui, sans-erif; font-size: 1rem; padding-bottom: .75rem; line-height: 1.45;">%s invited you to %s on ImmerNote.</p>
		<a href="%s" style="background-color: #0070f3; text-decoration: none; color: #fff;font-family: Inter, system-ui, sans-erif; font-size: 1rem; letter-spacing: -0.01em; font-weight: 600; font-size: 1.25rem; padding: 1rem 2rem; border-radius: 4px; display: block; width: 12rem; margin: 0 auto;">Log in to ImmerNote</a>
	</div>`, inviter, space, link)
	}
}

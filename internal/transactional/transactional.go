package transactional

import (
	"crypto/tls"
	"time"

	"github.com/immernote/immernote/internal/config"
	mail "github.com/xhit/go-simple-mail/v2"
)

func Send(subject, to, text, html string) error {
	server := mail.NewSMTPClient()
	config := config.Get()

	// SMTP Server
	server.Host = config.SMTP_HOST
	server.Port = config.SMTP_PORT
	server.Username = config.SMTP_USERNAME
	server.Password = config.SMTP_PASSWORD
	server.Encryption = mail.EncryptionSTARTTLS

	// Variable to keep alive connection
	// server.KeepAlive = false

	// Timeout for connect to SMTP Server
	server.ConnectTimeout = 20 * time.Second

	// Timeout for send the data and wait respond
	server.SendTimeout = 20 * time.Second

	// Set TLSConfig to provide custom TLS configuration. For example,
	// to skip TLS verification (useful for testing):
	server.TLSConfig = &tls.Config{
		InsecureSkipVerify: true,
	}

	// SMTP client
	smtp_client, err := server.Connect()
	if err != nil {
		return err
	}

	// New email simple html with inline and CC
	email := mail.NewMSG()
	email.SetFrom("From ImmerNote <mail@immernote.com>").
		AddTo(to).
		SetSubject(subject)

	email.SetBody(mail.TextPlain, text)
	email.AddAlternative(mail.TextHTML, html)

	// Call Send and pass the client
	if err := email.Send(smtp_client); err != nil {
		return err
	}

	return nil
}

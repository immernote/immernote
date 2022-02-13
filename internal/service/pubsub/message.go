package pubsub

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/immernote/immernote/internal/action"
)

type Message map[string]interface{}

// Shortcut to parse, apply, and broadcast the message
func HandleMessage(msg []byte, c *Client) ([]Message, error) {
	messages, err := NewMessage(msg)
	if err != nil {
		return messages, err
	}

	for index, message := range messages {
		// Append senderID
		messages[index]["sender_id"] = c.ID
		messages[index]["conn_id"] = c.ConnID

		switch msg_type := message["type"].(string); msg_type {
		case "add_block":
			log.Println("Add Block Message")
			log.Printf("\n%+v\n", message)
			if err := action.AddBlock(action.AddBlockParams{
				ID:       message["id"].(string),
				ParentID: message["parent_id"],
				SpaceID:  string(c.TableID.String()),
				Content:  message["content"].(map[string]interface{}),
				Format:   message["format"].(map[string]interface{}),
				UserID:   c.ID,
				Type:     message["type"].(string),
			}); err != nil {
				return messages, err
			}
		case "replace_block":
			log.Println("Replace Block Message")
			log.Printf("\n%+v\n", message)
			if err := action.ReplaceBlock(action.ReplaceBlockParams{
				ID:      message["id"].(string),
				Content: message["content"],
				Format:  message["format"],
			}); err != nil {
				return messages, err
			}
		case "fetch":
			log.Println("Fetch Message")
		case "ping":
			log.Println("Ping Message")
		default:
			return messages, fmt.Errorf("unsupported op %s", msg_type)
		}
	}

	return messages, nil
}

// Parse and return the message
func NewMessage(msg []byte) ([]Message, error) {
	parsed := []Message{}

	if err := json.Unmarshal(msg, &parsed); err != nil {
		return nil, err
	}

	return parsed, nil
}

type VersionMismatchError struct{}

func (vm *VersionMismatchError) Error() string {
	return "there is a version mismatch"
}

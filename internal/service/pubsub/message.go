package pubsub

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/immernote/immernote/internal/action"
)

type Message struct {
	Type     string                 `json:"type"`
	Payload  map[string]interface{} `json:"payload"`
	SenderID string                 `json:"sender_id"`
	ConnID   string                 `json:"connd_id"`
}

// Shortcut to parse, apply, and broadcast the message
func HandleMessage(msg []byte, c *Client) ([]Message, error) {
	messages, err := NewMessage(msg)
	if err != nil {
		return messages, err
	}

	for index, message := range messages {
		// Append senderID
		messages[index].SenderID = c.ID.String()
		messages[index].ConnID = c.ConnID

		switch msg_type := message.Type; msg_type {
		case "add_block":
			if err := action.AddBlock(action.AddBlockParams{
				ID:       message.Payload["id"].(string),
				ParentID: message.Payload["parent_id"],
				SpaceID:  string(c.TableID.String()),
				Content:  message.Payload["content"].(map[string]interface{}),
				Format:   message.Payload["format"].(map[string]interface{}),
				UserID:   c.ID,
				Type:     message.Payload["type"].(string),
			}); err != nil {
				return messages, err
			}
		case "add_blocks":
			if err := action.AddBlocks(action.AddBlocksParams{
				IDs:       message.Payload["ids"].([]interface{}),
				Types:     message.Payload["types"].([]interface{}),
				Contents:  message.Payload["contents"].([]interface{}),
				Formats:   message.Payload["formats"].([]interface{}),
				ParentIDs: message.Payload["parent_ids"].([]interface{}),
				UserID:    c.ID,
				SpaceID:   string(c.TableID.String()),
			}); err != nil {
				return messages, err
			}
		case "replace_block":
			log.Println("Replace Block Message")
			log.Printf("\n%+v\n", message)
			if err := action.ReplaceBlock(action.ReplaceBlockParams{
				ID:      message.Payload["id"].(string),
				Content: message.Payload["content"],
				Format:  message.Payload["format"],
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

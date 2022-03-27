package pubsub

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/immernote/immernote/internal/action"
)

type Message struct {
	Type     string           `json:"type"`
	Payload  *json.RawMessage `json:"payload"`
	SenderID string           `json:"sender_id"`
	ConnID   string           `json:"connd_id"`
}

// Shortcut to parse, apply, and broadcast the message
func HandleMessage(msg []byte, c *Client) ([]Message, error) {
	messages, err := NewMessage(msg)
	if err != nil {
		return messages, err
	}

	for index, message := range messages {
		// Append senderID and ConnID
		messages[index].SenderID = c.ID.String()
		messages[index].ConnID = c.ConnID

		switch message.Type {
		// case "add_block":
		// 	p := message.Payload.(map[string]interface{})
		// 	if err := action.AddBlock(action.AddBlockParams{
		// 		ID:       p["id"].(string),
		// 		ParentID: p["parent_id"],
		// 		SpaceID:  string(c.TableID.String()),
		// 		Content:  p["content"].(map[string]interface{}),
		// 		Format:   p["format"].(map[string]interface{}),
		// 		UserID:   c.ID,
		// 		Type:     p["type"].(string),
		// 	}); err != nil {
		// 		return messages, err
		// 	}
		// case "add_blocks":
		// 	p := message.Payload.(map[string]interface{})
		// 	if err := action.AddBlocks(action.AddBlocksParams{
		// 		IDs:       p["ids"].([]interface{}),
		// 		Types:     p["types"].([]interface{}),
		// 		Contents:  p["contents"].([]interface{}),
		// 		Formats:   p["formats"].([]interface{}),
		// 		ParentIDs: p["parent_ids"].([]interface{}),
		// 		UserID:    c.ID,
		// 		SpaceID:   string(c.TableID.String()),
		// 	}); err != nil {
		// 		return messages, err
		// 	}
		// case "replace_block":
		// 	log.Println("Replace Block Message")
		// 	log.Printf("\n%+v\n", message)
		// 	p := message.Payload.(map[string]interface{})
		// 	if err := action.ReplaceBlock(action.ReplaceBlockParams{
		// 		ID:      p["id"].(string),
		// 		Content: p["content"],
		// 		Format:  p["format"],
		// 	}); err != nil {
		// 		return messages, err
		// 	}
		case "transaction":
			tr := new(action.Transaction)
			if err := json.Unmarshal(*message.Payload, tr); err != nil {
				return messages, err
			}
			if err := action.ApplyTransaction(*tr); err != nil {
				return messages, err
			}
		case "fetch":
			log.Println("Fetch Message")
		case "ping":
			log.Println("Ping Message")
		default:
			return messages, fmt.Errorf("unsupported op %s", message.Type)
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

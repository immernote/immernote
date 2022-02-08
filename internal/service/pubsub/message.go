package pubsub

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/immernote/immernote/internal/action"
)

type Message map[string]interface{}

// Shortcut to parse, apply, and broadcast the message
func HandleMessage(msg []byte, c *Client) (Message, error) {
	message, err := NewMessage(msg)
	if err != nil {
		return message, err
	}

	// Append senderID
	message["sender_id"] = c.ID
	message["conn_id"] = c.ConnID

	switch msg_type := message["type"].(string); msg_type {
	case "add_page":
		log.Println("Add Page Message")
		log.Printf("\n%+v\n", message)
		if err := action.AddPage(action.AddPageParams{
			ID:       message["id"].(string),
			ParentID: message["parent_id"],
			SpaceID:  string(c.TableID.String()),
			Content:  message["content"].(map[string]interface{}),
			Format:   message["format"].(map[string]interface{}),
			UserID:   c.ID,
		}); err != nil {
			return message, err
		}
	case "add_paragraph":
		log.Println("Add Page Message")
		log.Printf("\n%+v\n", message)
		if err := action.AddParagraph(action.AddParagraphParams{
			ID:       message["id"].(string),
			ParentID: message["parent_id"].(string),
			SpaceID:  string(c.TableID.String()),
			Content:  message["content"].(map[string]interface{}),
			Format:   message["format"].(map[string]interface{}),
			UserID:   c.ID,
		}); err != nil {
			return message, err
		}
		// if err := action.ApplyPatches(action.ApplyPatchesParams{Patches: message.Data, UserID: message.SenderID}); err != nil {
		// 	return message, nil
		// }
	case "fetch":
		log.Println("Fetch Message")
	case "ping":
		log.Println("Ping Message")
	default:
		return message, fmt.Errorf("unsupported op %s", msg_type)
	}

	return message, nil
}

// Parse and return the message
func NewMessage(msg []byte) (Message, error) {
	parsed := make(Message)

	if err := json.Unmarshal(msg, &parsed); err != nil {
		return nil, err
	}

	return parsed, nil
}

// TODO: One big commit inside Apply, and try to automate as much as possible

// // Apply the message's operation
// func (m *Message) Apply(c *Client) error {
// 	switch m.Type {
// 	case "patch":
// 		pq, err := db.Prepare(database.Ctx, database.Get())
// 		if err != nil {
// 			return err
// 		}

// 		tx, err := database.Get().Begin()
// 		if err != nil {
// 			return err
// 		}

// 		for _, patch := range m.Data {
// 			if err := patch.Apply(tx, pq, m); err != nil {
// 				return err
// 			}
// 		}

// 		if err := tx.Commit(); err != nil {
// 			return err
// 		}

// 		return nil
// 	case "ping":
// 		c.CurrentPage = m.Page
// 		return nil
// 	default:
// 		return fmt.Errorf("unsupported op %s", m.Type)
// 	}
// }

// // Apply the patch's operation
// func (p *Patch) Apply(tx *sql.Tx, pq *db.Queries, m *Message) error {
// 	switch p.Op {
// 	case "add":
// 		return p.Add(tx, pq, m)
// 	case "replace":
// 		return p.Replace(tx, pq, m)
// 	default:
// 		tx.Rollback()
// 		return fmt.Errorf("unsupported op %s", p.Op)
// 	}
// }

// // Add a field using either CollectionID or DocumentID
// func (p *Patch) Add(tx *sql.Tx, pq *db.Queries, m *Message) error {
// 	switch p.Path[0] {
// 	case "fields":
// 		// We assume that fields/*/value is not allowed
// 		f := new(struct {
// 			db.Field
// 			Data json.RawMessage `json:"data"`
// 		})
// 		if err := json.Unmarshal(p.Value, f); err != nil {
// 			tx.Rollback()
// 			return err
// 		}

// 		// Check UUID is valid
// 		if f.ID == uuid.Nil {
// 			tx.Rollback()
// 			return errors.New("invalid params")
// 		}

// 		fieldDefault, err := utils.ExtractData(f.Data)
// 		if err != nil {
// 			tx.Rollback()
// 			return err
// 		}

// 		rf, err := pq.WithTx(tx).CreateField(database.Ctx, db.CreateFieldParams{
// 			Name:         "New Field",
// 			Type:         f.Type,
// 			Data:         fieldDefault,
// 			ID:           f.ID,
// 			CollectionID: f.CollectionID,
// 		})
// 		if err != nil {
// 			tx.Rollback()
// 			return err
// 		}

// 		strValue, err := json.Marshal(rf)
// 		if err != nil {
// 			tx.Rollback()
// 			return err
// 		}

// 		m.ReturnedData = append(m.ReturnedData, Patch{
// 			Op:    p.Op,
// 			Path:  p.Path,
// 			Value: strValue,
// 		})

// 		return nil
// 	case "blocks":
// 		switch p.Path[1] {
// 		// Batch create
// 		case "*":
// 			b := new(struct {
// 				db.Block
// 				// Fixes error with converting object to string
// 				Data json.RawMessage
// 			})
// 			if err := json.Unmarshal(p.Value, b); err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			// Check documentID is valid
// 			if b.DocumentID == uuid.Nil {
// 				tx.Rollback()
// 				return errors.New("invalid params")
// 			}

// 			blockDefault, err := utils.ExtractData(b.Data)
// 			if err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			rb, err := pq.WithTx(tx).BatchCreateBlocksByDocumentID(database.Ctx, db.BatchCreateBlocksByDocumentIDParams{
// 				Data:       blockDefault,
// 				ParentID:   pgtype.UUID{Status: pgtype.Null},
// 				FieldID:    b.FieldID,
// 				CreatedBy:  m.SenderID,
// 				DocumentID: b.DocumentID,
// 			})
// 			if err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			for _, b := range rb {
// 				strValue, err := json.Marshal(b)
// 				if err != nil {
// 					tx.Rollback()
// 					return err
// 				}

// 				m.ReturnedData = append(m.ReturnedData, Patch{
// 					Op:    p.Op,
// 					Path:  []interface{}{"blocks", b.ID},
// 					Value: strValue,
// 				})
// 			}

// 			return nil
// 		default:
// 			// Loop over blocks by documentID
// 			return nil
// 		}
// 	default:
// 		tx.Rollback()
// 		return fmt.Errorf("unsupported table %s", p.Path[0])
// 	}
// }

// func (p *Patch) Replace(tx *sql.Tx, pq *db.Queries, m *Message) error {
// 	switch p.Path[0] {
// 	case "fields":
// 		fieldID, err := uuid.Parse(p.Path[1].(string))
// 		if err != nil {
// 			tx.Rollback()
// 			return err
// 		}

// 		equal, err := pq.WithTx(tx).HasFieldByIDVersion(database.Ctx, db.HasFieldByIDVersionParams{
// 			ID:      fieldID,
// 			Version: p.Version - 1,
// 		})
// 		if err != nil {
// 			tx.Rollback()
// 			return err
// 		}

// 		if !equal {
// 			tx.Rollback()
// 			return &VersionMismatchError{}
// 		}

// 		switch p.Path[2] {
// 		case "type":
// 			if _, err := pq.WithTx(tx).UpdateFieldTypeByID(database.Ctx, db.UpdateFieldTypeByIDParams{
// 				ID:   fieldID,
// 				Type: string(p.Value),
// 			}); err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			m.ReturnedData = append(m.ReturnedData,
// 				Patch{
// 					Op:      p.Op,
// 					Path:    p.Path,
// 					Value:   p.Value,
// 					Version: p.Version,
// 				})

// 			return nil
// 		case "data":
// 			fieldData, err := utils.ExtractData(p.Value)
// 			if err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			if _, err := pq.WithTx(tx).UpdateFieldDataByID(database.Ctx, db.UpdateFieldDataByIDParams{
// 				ID:   fieldID,
// 				Data: fieldData,
// 			}); err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			m.ReturnedData = append(m.ReturnedData,
// 				Patch{
// 					Op:      p.Op,
// 					Path:    p.Path,
// 					Value:   p.Value,
// 					Version: p.Version,
// 				})

// 			return nil
// 		case "name":
// 			var name string
// 			if err := json.Unmarshal(p.Value, &name); err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			if _, err := pq.WithTx(tx).UpdateFieldNameByID(database.Ctx, db.UpdateFieldNameByIDParams{
// 				ID:   fieldID,
// 				Name: name,
// 			}); err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			m.ReturnedData = append(m.ReturnedData,
// 				Patch{
// 					Op:      p.Op,
// 					Path:    p.Path,
// 					Value:   p.Value,
// 					Version: p.Version,
// 				})

// 			return nil
// 		default:
// 			tx.Rollback()
// 			return fmt.Errorf("invalid path %s", p.Path)
// 		}
// 	case "blocks":
// 		switch p.Path[1] {
// 		case "fields":
// 			// blocks/fields/:fieldID/data
// 			fieldID, err := uuid.Parse(p.Path[2].(string))
// 			if err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			blockData, err := utils.ExtractData(p.Value)
// 			if err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			rb, err := pq.WithTx(tx).UpdateBlocksDataByFieldID(database.Ctx, db.UpdateBlocksDataByFieldIDParams{
// 				Data:       blockData,
// 				FieldID:    fieldID,
// 				ModifiedBy: m.SenderID,
// 			})
// 			if err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			for _, b := range rb {
// 				m.ReturnedData = append(m.ReturnedData,
// 					Patch{
// 						Op:      p.Op,
// 						Path:    []interface{}{"blocks", b.ID, "data"},
// 						Value:   p.Value,
// 						Version: b.Version,
// 					})
// 			}

// 			return nil
// 		default:
// 			// blocks/:ID/data
// 			blockID, err := uuid.Parse(p.Path[1].(string))
// 			if err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			equal, err := pq.WithTx(tx).HasBlockByIDVersion(database.Ctx, db.HasBlockByIDVersionParams{
// 				ID:      blockID,
// 				Version: p.Version - 1,
// 			})
// 			if err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			if !equal {
// 				tx.Rollback()
// 				return &VersionMismatchError{}
// 			}

// 			blockData, err := utils.ExtractData(p.Value)
// 			if err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			if _, err := pq.WithTx(tx).UpdateBlockDataByID(database.Ctx, db.UpdateBlockDataByIDParams{
// 				Data:       blockData,
// 				ID:         blockID,
// 				ModifiedBy: m.SenderID,
// 			}); err != nil {
// 				tx.Rollback()
// 				return err
// 			}

// 			m.ReturnedData = append(m.ReturnedData,
// 				Patch{
// 					Op:      p.Op,
// 					Path:    []interface{}{"blocks", blockID, "data"},
// 					Value:   p.Value,
// 					Version: p.Version,
// 				})

// 			return nil
// 		}
// 	default:
// 		tx.Rollback()
// 		return fmt.Errorf("unsupported table %s", p.Path[0])
// 	}
// }

type VersionMismatchError struct{}

func (vm *VersionMismatchError) Error() string {
	return "there is a version mismatch"
}

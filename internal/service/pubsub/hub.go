package pubsub

import (
	"encoding/json"
	"log"

	"github.com/immernote/immernote/internal/mem"
)

type PubSubMessage struct {
	Channel string
	Payload string
}

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients by channel name
	Clients map[string]map[*Client]bool

	// Inbound messages from the clients to Redis
	Broadcast chan PubSubMessage

	// Outbound messages from redis to the clients.
	Repeat chan PubSubMessage

	// Register requests from the clients.
	Register chan *Client

	// Unregister requests from clients.
	Unregister chan *Client
}

var RunningHub *Hub

func NewHub() *Hub {
	RunningHub = &Hub{
		Broadcast:  make(chan PubSubMessage),
		Repeat:     make(chan PubSubMessage),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[string]map[*Client]bool),
	}

	return RunningHub
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			// 			if Collections[connection.SpaceID.String()] == nil {
			// 				Collections[connection.SpaceID.String()] = map[*websocket.Conn]Client{}
			// 			}

			// 			Collections[connection.SpaceID.String()][connection.Conn] = Client{
			// 				ID:      connection.UserID,
			// 				Table:   connection.Table,
			// 				TableID: connection.TableID,
			// 			}
			if h.Clients[client.Channel] == nil {
				h.Clients[client.Channel] = map[*Client]bool{}
			}

			h.Clients[client.Channel][client] = true
		case client := <-h.Unregister:
			if _, ok := h.Clients[client.Channel][client]; ok {
				delete(h.Clients[client.Channel], client)
				close(client.Send)

				// Empty channel if it has no clients
				if len(h.Clients[client.Channel]) == 0 {
					delete(h.Clients, client.Channel)
				}
			}
		case message := <-h.Broadcast:
			log.Println("Broadcasting ", message)
			if err := mem.Get().Publish(mem.Ctx, message.Channel, message.Payload).Err(); err != nil {
				log.Println(err)
				return
			}
		case message := <-h.Repeat:
			p := new(Message)
			if err := json.Unmarshal([]byte(message.Payload), p); err != nil {
				return
			}

			for client := range h.Clients[message.Channel] {
				if client.ConnID != p.ConnID {
					select {
					case client.Send <- []byte(message.Payload):
					default:
						delete(h.Clients[client.Channel], client)
						close(client.Send)

						// Empty channel if it has no clients
						if len(h.Clients[client.Channel]) == 0 {
							delete(h.Clients, client.Channel)
						}
					}
				}
			}
		}
	}
}

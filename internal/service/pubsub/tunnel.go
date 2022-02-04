package pubsub

import (
	"log"

	"github.com/immernote/immernote/internal/mem"
)

func (h *Hub) RunTunnel() {
	pb := mem.Get().PSubscribe(mem.Ctx, "*")
	_, err := pb.Receive(mem.Ctx)
	if err != nil {
		log.Println(err)
		return
	}

	for {
		msg, err := pb.ReceiveMessage(mem.Ctx)
		if err != nil {
			log.Println(err)
			return
		}

		log.Println("Received message through tunnel", msg)

		h.Repeat <- PubSubMessage{
			Channel: msg.Channel,
			Payload: msg.Payload,
		}
	}
}

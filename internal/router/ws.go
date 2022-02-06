package router

import (
	"log"
	"net/http"

	"github.com/immernote/immernote/internal/service/pubsub"
	gonanoid "github.com/matoous/go-nanoid/v2"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleWs(c *gin.Context) {
	if len(c.Query("space_id")) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "`space_id` is missing"})
		return
	}

	if _, err := uuid.Parse(c.Query("space_id")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "`space_id` is malformed"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		return
	}

	pbChn := "space:" + c.Query("space_id")

	tableID, err := uuid.Parse(c.Query("space_id"))
	if err != nil {
		log.Println(c.Query("space_id"), err)
		return
	}

	connID, err := gonanoid.New()
	if err != nil {
		log.Println(err)
		return
	}

	client := &pubsub.Client{
		Hub:     pubsub.RunningHub,
		Conn:    conn,
		Send:    make(chan []byte, 256),
		ID:      c.MustGet("user_id").(uuid.UUID),
		ConnID:  connID,
		Table:   "spaces",
		TableID: tableID,
		Channel: pbChn,
	}

	client.Hub.Register <- client

	go client.WritePump()
	go client.ReadPump()
}

package migrate

import (
	"log"
	"os/exec"
)

func Exec() {
	dbmate := exec.Command("dbmate", "-d", "./database/migrations", "-s", "./database/schema.sql", "--wait", "up")
	if output, err := dbmate.CombinedOutput(); err != nil {
		log.Fatalln(err, string(output))
	}
}

package migrate

import (
	"log"
	"os/exec"
)

func Exec() {
	dbmate := exec.Command("dbmate", "--wait", "up")
	if output, err := dbmate.CombinedOutput(); err != nil {
		log.Fatalln(err, string(output))
	}
}

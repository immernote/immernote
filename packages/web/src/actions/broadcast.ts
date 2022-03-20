import { send } from "~/stores/msg";
import create_transaction from "./create_transaction";

type Payload = Readonly<ReturnType<typeof create_transaction>[]>;

export default function broadcast(...payload: Payload) {
	console.log(payload)
  send(...(payload as any));

  return payload;
}

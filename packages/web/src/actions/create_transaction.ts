import type create_block from "./create_block";
import type update_block from "./update_block";

type Payload = (ReturnType<typeof create_block> | ReturnType<typeof update_block>)[];

export default function create_transaction(...payload: Payload) {
  return {
    type: "transaction",
    payload,
  } as const;
}

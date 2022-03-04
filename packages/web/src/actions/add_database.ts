import { send } from "../stores/msg";
import { MsgParams } from "../types";
import { v4 as uuid } from "@lukeed/uuid";
import { add_block } from "./add_block";

export async function add_database(
  params: MsgParams<"add_database", "database">,
  broadcast: boolean = true
) {
  const db_payload: MsgParams<"add_block", "database"> = {
    id: uuid(),
    content: { title: "New database" },
    format: { icon: { type: "emoji", value: "🦄" } },
    parent_id: params.parent_id,
    type: "database",
  };

  const field_payload: MsgParams<"add_block", "field"> = {
    id: uuid(),
    content: { title: "" },
    format: { icon: { type: "", value: "" } },
    parent_id: db_payload.id,
    type: "field",
  };

  const view_payload: MsgParams<"add_block", "view"> = {
    id: uuid(),
    content: { title: "" },
    format: { icon: { type: "", value: "" } },
    parent_id: db_payload.id,
    type: "view",
  };

  add_block(db_payload, false);
  add_block(field_payload, false);
  add_block(view_payload, false);

  if (broadcast) {
    send({
      type: "add_blocks",
      payload: {
        ids: [db_payload.id, field_payload.id, view_payload.id],
        contents: [db_payload.content, field_payload.content, view_payload.content],
        formats: [db_payload.format, field_payload.format, view_payload.format],
        parent_ids: [db_payload.parent_id, field_payload.parent_id, view_payload.parent_id],
        types: [db_payload.type, field_payload.type, view_payload.type],
      },
    });
  }
}

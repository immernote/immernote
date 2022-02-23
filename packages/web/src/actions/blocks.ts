import { set, useData } from "../stores/data";
import { send } from "../stores/msg";
import type { Block, BlockType, MsgParams } from "../types";
import { v4 as uuid } from "@lukeed/uuid";

export async function add_block<T extends BlockType>(
  params: MsgParams<"add_block", T>,
  broadcast: boolean = true
) {
  const user_id = useData.getState().user;
  if (!user_id) return;

  // @ts-ignore
  const new_block: Extract<Block, { type: T }> = {
    id: params.id,
    content: params.content,
    format: params.format,

    type: params.type,
    space_id: "",

    children: [],

    created_by: user_id,
    modified_by: user_id,

    created_at: Date.now(),
    modified_at: Date.now(),
    deleted_at: null,
  };

  set((state) => {
    state.blocks[new_block.id] = new_block;

    if (params.type === "page" || params.type === "database") {
      state.pages[new_block.id] = [];
    }

    if (params.parent_id && state.blocks[params.parent_id]) {
      state.blocks[params.parent_id]!.children.push(new_block.id);
    }
  });

  if (broadcast) {
    send({
      type: "add_block",
      payload: params,
    });
  }
}

export async function add_database(
  params: MsgParams<"add_database", "database">,
  broadcast: boolean = true
) {
  // Database
  add_block(
    {
      id: uuid(),
      content: { title: "" },
      format: { icon: { type: "", value: "" } },
      parent_id: params.parent_id,
      type: "database",
    },
    false
  );

  // Field
  add_block(
    {
      id: uuid(),
      content: { title: "" },
      format: { icon: { type: "", value: "" } },
      parent_id: params.parent_id,
      type: "field",
    },
    false
  );

  // View
  add_block(
    {
      id: uuid(),
      content: { title: "" },
      format: { icon: { type: "", value: "" } },
      parent_id: params.parent_id,
      type: "view",
    },
    false
  );

  if (broadcast) {
    send(
      {
        type: "add_block",
        payload: params,
      },
      {
        type: "add_block",
        payload: params,
      },
      {
        type: "add_block",
        payload: params,
      }
    );
  }
}

export async function replace_block<T extends BlockType>(
  params: MsgParams<"replace_block", T>,
  broadcast: boolean = true
) {
  const user_id = useData.getState().user;
  if (!user_id) return;

  set((state) => {
    if (params.content) state.blocks[params.id]!.content = params.content;
    if (params.format) state.blocks[params.id]!.format = params.format;
  });

  if (broadcast) {
    send({
      type: "replace_block",
      payload: params,
    });
  }
}

import { set, useData } from "../stores/data";
import { send } from "../stores/msg";
import type { Block, MsgParams } from "../types";

export async function add_page(params: MsgParams<"add_page">) {
  const user_id = useData.getState().user;
  if (!user_id) return;

  const new_block: Block<"page"> = {
    id: params.id,
    content: params.content,
    format: params.format,

    type: "page",
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
    state.pages[new_block.id] = [];

    if (params.parent_id && state.blocks[params.parent_id]) {
      state.blocks[params.parent_id]!.children.push(new_block.id);
    }
  });

  send({
    type: "add_page",
    ...params,
  });
}

export async function add_paragraph(params: MsgParams<"add_paragraph">) {
  const user_id = useData.getState().user;
  if (!user_id) return;

  const new_block: Block<"paragraph"> = {
    id: params.id,
    content: params.content,
    format: params.format,

    type: "paragraph",
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

    if (params.parent_id && state.blocks[params.parent_id]) {
      state.blocks[params.parent_id]!.children.push(new_block.id);
    }
  });

  send({
    type: "add_paragraph",
    ...params,
  });
}

export async function replace_paragraph(params: MsgParams<"replace_paragraph">) {
  const user_id = useData.getState().user;
  if (!user_id) return;

  set((state) => {
    if (params.content) state.blocks[params.id]!.content = params.content;
    if (params.format) state.blocks[params.id]!.format = params.format;
  });

  send({
    type: "replace_paragraph",
    ...params,
  });
}

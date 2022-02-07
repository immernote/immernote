import { set, useData } from "../stores/data";
import { send } from "../stores/msg";
import type { Block, MsgParams } from "../types";
import { aksios } from "../utils/aksios";

export async function add_block(params: MsgParams<"add_page">) {
  const user_id = useData.getState().user?.id;
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

export async function create_paragraph_block(body: {
  id: string;
  content: {};
  format: {};
  parent_block_id: string | null;
  parent_pages_ids: string[];
  parent_page_id: string | null;
  space_id: string;
}) {
  await aksios<Block>("/v0/blocks/paragraph", "POST", body);
}

export async function update_block_content(body: { id: string; content: {} }) {
  await aksios<Block>("/v0/blocks/content", "PUT", body);
}

import { patch } from "../stores/data";
import type { Block } from "../types";
import { aksios } from "../utils/aksios";

export async function create_page_block(block: { type: "page" } & Block, parent_id?: string) {
  patch((state) => {
    state.blocks[block.id] = block;
    state.pages[block.id] = [];

    if (parent_id && state.blocks[parent_id]) {
      state.blocks[parent_id]!.children = [...state.blocks[parent_id]!.children, block.id];
    }
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

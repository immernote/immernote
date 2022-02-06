import { patch } from "../stores/data";
import type { Block } from "../types";
import { aksios } from "../utils/aksios";

export async function create_page_block(body: {
  id: string;
  content: {};
  format: {};
  parent_block_id: string | null;
  parent_pages_ids: string[];
  space_id: string;
}) {
  // await aksios<Block>("/v0/blocks/pages", "POST", body);
  patch((state) => {
    state.blocks[body.id] = {
      ...body,
    };
    state.pages[body.id] = [];
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

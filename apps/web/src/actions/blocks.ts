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
  await aksios<Block>("/v0/blocks/pages", "POST", body);
}

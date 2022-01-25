import type { KeyedMutator } from "swr";
import type { Block } from "../types";
import { aksios } from "../utils/aksios";

export async function create_page_block(
  body: {
    id: string;
    content: {};
    format: {};
    parent_block_id: string | null;
    parent_page_id: string | null;
    space_id: string;
  },
  mutate: KeyedMutator<Block[]>
) {
  await mutate((data = []) => [...data, body as Block], false);
  await aksios<Block>("/v0/blocks/pages", "POST", body);
  await mutate();
}

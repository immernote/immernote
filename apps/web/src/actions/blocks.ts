import { aksios } from "../utils/aksios";
import type { User } from "../types";

export function create_page_block(body: {
  id: string;
  content: string;
  format: string;
  parent_block_id: string | null;
  parent_page_id: string | null;
  space_id: string;
}) {
  return aksios<User>("/v0/blocks/pages", "POST", body);
}

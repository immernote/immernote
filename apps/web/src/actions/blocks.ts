import { aksios } from "../utils/aksios";
import type { User } from "../types";

export function create_page_block(email: string) {
  return aksios<User>("/v0/blocks/page", "POST", { email });
}

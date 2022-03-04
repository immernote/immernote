import { User } from "../types";
import { aksios } from "../utils/aksios";

export function confirm(token: string, user_id: string) {
  return aksios<User>("/v0/confirm", "POST", { token, user_id });
}

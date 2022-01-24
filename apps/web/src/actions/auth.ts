import type { User } from "../types";
import { aksios } from "../utils/aksios";

export function login(email: string) {
  return aksios<User>("/v0/login", "POST", { email });
}

export function confirm(token: string, userID: string) {
  return aksios<User>("/v0/confirm", "POST", { token, userID });
}

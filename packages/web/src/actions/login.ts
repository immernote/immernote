import { User } from "../types";
import { aksios } from "../utils/aksios";

export function login(email: string) {
  return aksios<User>("/v0/login", "POST", { email });
}

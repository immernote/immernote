import { User } from "~/types/User";
import { aksios } from "~/utils/aksios";

export function login(email: string) {
  return aksios<User>("/v0/login", "POST", { email });
}

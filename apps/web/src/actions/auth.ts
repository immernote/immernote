import type { User } from "../interfaces/user";
import { aksios } from "../utils/aksios";

export async function login(email: string) {
	return aksios<User>("/v0/login", "POST", { email });
}

export async function confirm(token: string, userID: string) {
	return aksios<User>("/v0/confirm", "POST", { token, userID });
}

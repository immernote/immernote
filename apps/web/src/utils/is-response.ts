import type { Response } from "redaxios"
export function isResponse<T>(error: unknown): error is Response<T> {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		typeof (error as Record<string, unknown>).status === "number"
	)
}

import type { Response } from "redaxios";

export function is_response<T>(error: unknown): error is Response<T> {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as Record<string, unknown>).status === "number"
  );
}

export function is_void<T>(x: T | void): x is void {
  return x == null;
}

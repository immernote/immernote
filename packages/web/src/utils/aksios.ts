import axios from "redaxios";
import type { Response, Options } from "redaxios";
import { is_response } from "./is";

/**
 * Wraps axios for simpler fetches
 */
export async function aksios<T>(
  url: `/${string}`,
  method: Options["method"] = "GET",
  data?: Options["data"]
): Promise<[ok: Response<T> | null, not_ok: Response<T> | null, error: unknown]> {
  try {
    return [
      await axios<T>({
        url: `/api${url}`,
        method,
        data,
      }),
      null,
      null,
    ];
  } catch (error) {
    if (is_response<T>(error)) {
      return [null, error, null];
    }
    return [null, null, error];
  }
}

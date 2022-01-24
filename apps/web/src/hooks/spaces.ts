import useSWR from "swr";
import { Space } from "../interfaces/space";

export function useSpaces() {
  return useSWR<Space[]>("/api/v0/spaces");
}

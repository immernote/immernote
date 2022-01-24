import { useParams } from "react-router-dom";
import useSWR from "swr";
import { Space } from "../types";

export function useSpaces() {
  return useSWR<Space[]>("/api/v0/spaces");
}

export function useCurrentSpace() {
  const { space } = useParams();

  return useSWR<Space>(space ? `/api/v0/spaces?handle=${space}` : null);
}

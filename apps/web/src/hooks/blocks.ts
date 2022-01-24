import useSWR from "swr";
import { Block } from "../types";
import { useCurrentSpace } from "./spaces";

export function usePageBlocks() {
  const { data: space } = useCurrentSpace();

  return useSWR<Block[]>(space?.handle ? `/api/v0/blocks/pages?spaceHandle=${space.handle}` : null);
}

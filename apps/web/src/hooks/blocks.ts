import useSWR from "swr";
import { Block } from "../types";
import { useCurrentSpace } from "./spaces";

export function usePageBlocks(parent_page_id?: string) {
  const { data: space } = useCurrentSpace();

  return useSWR<Block[]>(
    space?.handle
      ? `/api/v0/blocks/?type=page&space_handle=${space.handle}${
          parent_page_id ? `&parent_page_id=${parent_page_id}` : ""
        }`
      : null
  );
}

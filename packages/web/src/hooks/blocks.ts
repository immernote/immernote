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

export function usePageBlock(id: string | undefined) {
  return useSWR<Block>(id ? `/api/v0/block?id=${id}` : null);
}

export function usePageBlockChildren(parent_page_id: string | undefined) {
  const { data: space } = useCurrentSpace();

  return useSWR<Block[]>(
    space?.handle && parent_page_id
      ? `/api/v0/blocks/?space_handle=${space.handle}&parent_page_id=${parent_page_id}`
      : null
  );
}
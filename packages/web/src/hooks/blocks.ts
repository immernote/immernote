import { useParams } from "react-router-dom";
import useSWR from "swr";
import { Block } from "~/types/Block";
import { useCurrentSpace } from "./spaces";

export function usePageBlocks<T = any>(parent_id?: string) {
  const { space } = useParams();

  return useSWR<(Block & { type: T })[]>(
    space
      ? `/api/v0/blocks/?type=page_like&space_handle=${space}${
          parent_id ? `&parent_id=${parent_id}` : ""
        }`
      : null
  );
}

export function useViewBlocks(parent_id?: string) {
  const { space } = useParams();

  return useSWR<(Block & { type: "view" | "table_view" })[]>(
    space
      ? `/api/v0/blocks/?type=view&type=table_view&space_handle=${space}${
          parent_id ? `&parent_id=${parent_id}` : ""
        }`
      : null
  );
}

export function useViewBlock<T = "view" | "table_view">(id: string | undefined | null) {
  return useSWR<Block & { type: T }>(id ? `/api/v0/block?id=${id}` : null);
}

export function usePageBlock(id: string | undefined) {
  return useSWR<Block & { type: "page" }>(id ? `/api/v0/block?id=${id}` : null);
}

export function usePageBlockChildren(parent_id: string | undefined) {
  const { data: space } = useCurrentSpace();

  return useSWR<Block[]>(
    space?.handle && parent_id
      ? `/api/v0/blocks/?space_handle=${space.handle}&parent_id=${parent_id}&type=block_like`
      : null
  );
}

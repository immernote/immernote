import { useParams } from "react-router-dom";
import useSWR from "swr";
import { set } from "../stores/data";
import type { Block } from "../types";

export function useFetchBlockChildren(id: string | undefined) {
  const { space } = useParams();

  useSWR<Block[]>(
    space && id ? `/api/v0/blocks/?space_handle=${space}&parent_page_id=${id}` : null,
    {
      onSuccess: (data) => {
        set((state) => {
          for (const block of data) {
            state.blocks[block.id] = block;
          }
        });
      },
    }
  );
}

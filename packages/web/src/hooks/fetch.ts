import { useParams } from "react-router-dom";
import useSWR from "swr";
import { set } from "../stores/data";
import type { Block, Space, User } from "../types";

export function useFetchUser() {
  useSWR<User>(`/api/v0/users`, {
    onSuccess: (data) => {
      set((state) => {
        state.users[data.id] = data;
        state.user = data.id;
      });
    },
  });
}

export function useFetchSpaces() {
  useSWR<Space[]>(`/api/v0/spaces`, {
    onSuccess: (data) => {
      set((state) => {
        for (const space of data) {
          state.spaces[space.id] = space;
        }
      });
    },
  });
}

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

export function useFetchPageBlocks(parent_page_id: string | undefined) {
  const { space } = useParams();

  useSWR<Block[]>(
    space
      ? `/api/v0/blocks/?type=page&type=database&space_handle=${space}${
          parent_page_id ? `&parent_page_id=${parent_page_id}` : ""
        }`
      : null,
    {
      onSuccess: (data) => {
        set((state) => {
          const root_ids = [];
          for (const page of data) {
            state.blocks[page.id] = page;
            state.pages[page.id] = page.children.filter(
              (child_id) =>
                state.blocks[child_id]?.type === "page" ||
                state.blocks[child_id]?.type === "database"
            );

            if (!parent_page_id) {
              root_ids.push(page.id);
            }
          }

          if (!parent_page_id) {
            state.pages["root"] = root_ids;
          }
        });
      },
    }
  );
}

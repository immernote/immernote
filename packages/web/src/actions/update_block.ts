import { BlockType } from "~/types/BlockType";
import { BlockByType } from "~/types/BlockByType";
import type { RequireAtLeastOne } from "type-fest";

export default function update_block<T extends BlockType>(
  type: T,
  params: RequireAtLeastOne<
    Partial<Pick<BlockByType<T>, "content" | "format" | "modified_by" | "children">>
  > &
    Pick<BlockByType<T>, "id">
) {
  return {
    type: "update_block",
    payload: {
      type,
      ...params,
    },
  } as const;
}

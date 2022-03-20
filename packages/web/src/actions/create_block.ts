import { BlockType } from "~/types/BlockType";
import { BlockWithoutType } from "~/types/BlockWithoutType";
import { BlockByType } from "~/types/BlockByType";

export default function create_block<T extends BlockType>(
  type: T,
  {
    created_at = Date.now(),
    modified_at = Date.now(),
    deleted_at = null,
    ...params
  }: BlockWithoutType<T>
) {
  return {
    type: "create_block",
    payload: { type, ...params, created_at, modified_at, deleted_at },
  } as Readonly<{ type: "create_block"; payload: BlockByType<T> }>;
}

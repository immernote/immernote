import { set, useData } from "../stores/data";
import { send } from "../stores/msg";
import { Block, BlockType, Msg, MsgParams } from "../types";

export async function add_block<T extends BlockType>(
  params: MsgParams<"add_block", T>,
  broadcast: boolean = true
) {
  const user_id = useData.getState().user;
  if (!user_id) return;

  // @ts-ignore
  const new_block: Extract<Block, { type: T }> = {
    id: params.id,
    content: params.content,
    format: params.format,

    type: params.type,
    space_id: "",

    children: [],

    created_by: user_id,
    modified_by: user_id,

    created_at: Date.now(),
    modified_at: Date.now(),
    deleted_at: null,
  };

  set((state) => {
    state.blocks[new_block.id] = new_block;

    if (params.type === "page" || params.type === "database") {
      state.pages[new_block.id] = [];
    }

    if (params.parent_id && state.blocks[params.parent_id]) {
      state.blocks[params.parent_id]!.children.push(new_block.id);
    }
  });

  if (broadcast) {
    send({
      type: "add_block",
      payload: params,
    } as Msg);
  }
}

import { set, useData } from "~/stores/data";
import { send } from "~/stores/msg";
import { MsgParams } from "~/types/MsgParams";
import { Msg } from "~/types/Msg";
import { BlockType } from "~/types/BlockType";

export async function replace_block<T extends BlockType>(
  params: MsgParams<"replace_block", T>,
  broadcast: boolean = true
) {
  const user_id = useData.getState().user;
  if (!user_id) return;

  set((state) => {
    if (params.content) state.blocks[params.id]!.content = params.content;
    if (params.format) state.blocks[params.id]!.format = params.format;
  });

  if (broadcast) {
    send({
      type: "replace_block",
      payload: params,
    } as Msg);
  }
}

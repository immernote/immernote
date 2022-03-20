import { Msg } from "./Msg";
import { BlockType } from "./BlockType";


export type MsgParams<T extends Msg["type"], S extends BlockType> = Extract<
  Extract<Msg, { type: T; }>["payload"], { type: S; }
>;

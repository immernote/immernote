import { BlockType } from "./BlockType";
import { Block } from "./Block";
import { ExcludeTypeField } from "./ExcludeTypeField";

export type BlockWithoutType<T extends BlockType> = ExcludeTypeField<Extract<Block, { type: T }>>;

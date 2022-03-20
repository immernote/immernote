import { BlockType } from "./BlockType";
import { Block } from "./Block";

export type BlockByType<T extends BlockType> = Extract<Block, { type: T; }>;

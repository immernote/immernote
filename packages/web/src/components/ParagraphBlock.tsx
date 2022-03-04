import { useCallback } from "react";
import { replace_block } from "../actions/replace_block";
import { useFetchBlockChildren } from "../hooks/fetch";
import { useData } from "../stores/data";
import { Editable } from "./editable";
import { Block } from "../types";
import { dequal } from "dequal/lite";

type ParagraphBlockProps = {
  id: string;
};

export function ParagraphBlock({ id }: ParagraphBlockProps) {
  useFetchBlockChildren(id);

  const block = useData(
    useCallback((state) => state.blocks[id] as Extract<Block, { type: "paragraph" }>, [id]),
    dequal
  );

  const set_value = useCallback(
    (v: any[]) => {
      replace_block({
        id: id,
        type: "paragraph",
        content: { nodes: v },
        format: null,
      });
    },
    [id]
  );

  return block ? (
    <Editable key={id} id={id} value={block.content.nodes} set_value={set_value} />
  ) : null;
}

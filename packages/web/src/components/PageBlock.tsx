import { useCallback } from "react";
import { useFetchBlockChildren } from "../hooks/fetch";
import { useData } from "../stores/data";
import { Block } from "../types";
import { dequal } from "dequal/lite";

type PageBlockProps = {
  id: string;
};

export default function PageBlock({ id }: PageBlockProps) {
  useFetchBlockChildren(id);

  const page = useData(
    useCallback((state) => state.blocks[id] as Extract<Block, { type: "page" }>, [id]),
    dequal
  );

  return page ? <div>Paragraph level {id}</div> : null;
}

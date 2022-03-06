import { lazy, Suspense, useCallback } from "react";
import { useFetchBlockChildren } from "../hooks/fetch";
import { useData } from "../stores/data";
import { Block } from "../types";
import { dequal } from "dequal/lite";

const blocks_map = {
  page: lazy(() => import("./RootPageBlock")),
  database: lazy(() => import("./RootPageBlock")),
};

type RootBlockProps = {
  id: string;
};

export default function RootBlock({ id }: RootBlockProps) {
  useFetchBlockChildren(id);

  const block_type = useData(
    useCallback(
      (state) =>
        (state.blocks[id] as Extract<Block, { type: "page" | "database" }> | undefined)?.type,
      [id]
    ),
    dequal
  );

  if (!block_type) {
    return <div>Loading... </div>;
  }

  const Comp = blocks_map[block_type];
  return (
    <Suspense fallback={null}>
      <Comp id={id} />
    </Suspense>
  );
}

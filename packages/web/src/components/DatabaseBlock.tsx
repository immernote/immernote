import { useCallback } from "react";
import { useFetchBlockChildren } from "~/hooks/fetch";
import { useData } from "~/stores/data";
import { Block } from "~/types/Block";
import { dequal } from "dequal/lite";

type DatabaseBlockProps = {
  id: string;
};

export default function DatabaseBlock({ id }: DatabaseBlockProps) {
  useFetchBlockChildren(id);

  const database = useData(
    useCallback((state) => state.blocks[id] as Extract<Block, { type: "database" }>, [id]),
    dequal
  );

  return database ? <div>Database {id}</div> : null;
}

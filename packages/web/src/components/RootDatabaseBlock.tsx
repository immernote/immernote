import { v4 as uuid } from "@lukeed/uuid";
import { dequal } from "dequal/lite";
import { lazy, useCallback } from "react";
import { add_database } from "../actions/add_database";
import { useFetchBlockChildren } from "../hooks/fetch";
import { useData } from "../stores/data";
import type { Block, BlockType } from "../types";
import { Layout } from "./layout";

const BlockSwitch = lazy(() => import("./BlockSwitch"));

type RootDatabaseBlockProps = {
  id: string;
};

export default function RootDatabaseBlock({ id }: RootDatabaseBlockProps) {
  useFetchBlockChildren(id);
  // get view id from querystring or redirect to a default one
  // fetch view details
  // render correct view component

  const page = useData(
    useCallback(
      (state) => {
        const item = state.blocks[id] as Extract<Block, { type: "database" }> | undefined;
        if (!item) return;

        return {
          id: item.id,
          content: item.content,
          format: item.format,
        };
      },
      [id]
    ),
    dequal
  );

  const children = useData(
    useCallback(
      (state) => {
        const ids = state.blocks[id]?.children;
        if (!ids) return [];

        const list: [id: string, type: BlockType][] = new Array(ids.length);
        for (const [index, item_id] of ids.entries()) {
          if (state.blocks[item_id])
            list[index] = [state.blocks[item_id]!.id, state.blocks[item_id]!.type];
        }

        return list;
      },
      [id]
    ),
    dequal
  );

  if (!page) {
    return <div>Loading... </div>;
  }

  return (
    <Layout title={page.content.title}>
      <div className="w-full min-h-full max-h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto flex flex-col">
          <div className="inline-flex items-center gap-x-4 pt-16 pb-8">
            <div className="text-4xl">{page.format.icon.value}</div>
            <h1 className="text-6xl tracking-tight font-medium">{page.content.title}</h1>
          </div>
          {children.length > 0 ? (
            children.map(([child_id, child_type]) => (
              <BlockSwitch key={child_id} id={child_id} type={child_type} />
            ))
          ) : (
            <p>Write something</p>
          )}
          <div
            className="w-full cursor-text flex-grow h-32"
            onClick={async () => {
              // await add_block<"paragraph">({
              //   id: uuid(),
              //   type: "paragraph",
              //   content: {
              //     nodes: [{ type: "text", text: `Paragraph n. x` }],
              //   },
              //   format: {},
              //   parent_id: page.id,
              // });
              await add_database({
                database_id: uuid(),
                type: "database",
                parent_id: page.id,
              });
            }}
            role="textbox"
          />
        </div>
      </div>
    </Layout>
  );
}

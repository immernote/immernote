import { v4 as uuid } from "@lukeed/uuid";
import { dequal } from "dequal/lite";
import { lazy, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { add_block } from "../actions/add_block";
import { useViewBlock, useViewBlocks } from "../hooks/blocks";
import { useData } from "../stores/data";
import type { Block } from "../types";
import { Layout } from "./layout";

const ViewSwitch = lazy(() => import("./ViewSwitch"));

type RootDatabaseBlockProps = {
  id: string;
};

export default function RootDatabaseBlock({ id }: RootDatabaseBlockProps) {
  const [search_params, set_search_params] = useSearchParams();
  const view_id = search_params.get("v");
  const { data: views } = useViewBlocks(id);
  const { data: view } = useViewBlock(search_params.get("v"));

  // Redirect to default view if none is currently selected
  useEffect(() => {
    if (!view_id && views?.[0]?.id) set_search_params({ v: views[0].id });
  }, [view_id, views?.[0]?.id]);

  const database = useData(
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

  if (!database || !view_id || !view) {
    return <div>Loading... </div>;
  }

  return (
    <Layout title={database.content.title}>
      <div className="w-full min-h-full max-h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto flex flex-col">
          <div className="inline-flex items-center gap-x-4 pt-16 pb-8">
            <div className="text-4xl">{database.format.icon.value}</div>
            <h1 className="text-6xl tracking-tight font-medium">{database.content.title}</h1>
          </div>
          <ViewSwitch id={view_id} type={view.type} />
          <div
            className="w-full cursor-text flex-grow h-32"
            onClick={async () => {
              await add_block<"table_view">({
                id: uuid(),
                type: "table_view",
                content: {
                  title: "Table View",
                },
                format: {
                  icon: { type: "emoji", value: "🦄" },
                },
                parent_id: database.id,
              });
              // await add_database({
              //   database_id: uuid(),
              //   type: "database",
              //   parent_id: page.id,
              // });
            }}
            role="textbox"
          />
        </div>
      </div>
    </Layout>
  );
}

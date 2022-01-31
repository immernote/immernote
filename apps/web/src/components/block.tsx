import { useCallback } from "react";
import { useFetchBlockChildren } from "../hooks/fetch";
import { useData } from "../stores/data";
import { Layout } from "./layout";

type PageBlockProps = {
  id: string;
  root?: boolean;
};

export function PageBlock({ id, root = false }: PageBlockProps) {
  useFetchBlockChildren(id);

  const page = useData(useCallback((state) => state.blocks[id], [id]));
  const children = useData(
    useCallback(
      (state) => {
        const ids = state.blocks[id]?.children;
        if (!ids) return [];

        const list: [id: string, type: string][] = new Array(ids.length);
        for (const [index, item_id] of ids.entries()) {
          if (state.blocks[item_id])
            list[index] = [state.blocks[item_id]!.id, state.blocks[item_id]!.type];
        }

        return list;
      },
      [id]
    )
  );

  if (!page || !children) {
    return <div>Loading... </div>;
  }

  if (root) {
    return (
      <Layout title={page.content.title}>
        <div className="max-w-4xl mx-auto min-h-full flex flex-col">
          <div className="inline-flex items-center gap-x-4 pt-16 pb-8">
            <div className="text-4xl">{page.format.icon.value}</div>
            <h1 className="text-6xl tracking-tight font-medium">{page.content.title}</h1>
          </div>
          {children.length > 0 ? (
            children.map(([child_id, child_type]) => (
              <BlockSwitch key={child_id} id={child_id} type={child_type} />
            ))
          ) : (
            <div className="text-gray11">Empty page. Click to start writing.</div>
          )}
          <div
            className="w-full cursor-text flex-grow"
            onClick={() => {
              console.log("INSERT");
            }}
            role="textbox"
          ></div>
        </div>
      </Layout>
    );
  }

  return <div>Paragraph level {id}</div>;
}

function BlockSwitch({ id, type }: { id: string; type: string }) {
  switch (type) {
    case "page": {
      return <PageBlock id={id} />;
    }

    default: {
      console.error(`Unknown block type "${type}"`);
      return null;
    }
  }
}

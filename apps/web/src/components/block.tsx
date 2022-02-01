import { useCallback } from "react";
import { create_paragraph_block } from "../actions/blocks";
import { useFetchBlockChildren } from "../hooks/fetch";
import { useData } from "../stores/data";
import { Layout } from "./layout";
import { v4 as uuid } from "@lukeed/uuid";
import { Editable } from "./editable";
import shallow from "zustand/shallow";

/* ---------------------------------------------------------------------------------------------- */
/*                                            PageBlock                                           */
/* ---------------------------------------------------------------------------------------------- */

type PageBlockProps = {
  id: string;
  root?: boolean;
};

export function PageBlock({ id, root = false }: PageBlockProps) {
  useFetchBlockChildren(id);

  const page = useData(
    useCallback((state) => state.blocks[id], [id]),
    shallow
  );
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
    ),
    shallow
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
            onClick={async () => {
              console.log(page.parent_pages_ids);
              await create_paragraph_block({
                id: uuid(),
                content: {
                  text: ["New page"],
                },
                format: {},
                parent_block_id: page.id,
                parent_pages_ids: [...page.parent_pages_ids, page.id],
                parent_page_id: page.id,
                space_id: page.space_id,
              });
            }}
            role="textbox"
          />
        </div>
      </Layout>
    );
  }

  return <div>Paragraph level {id}</div>;
}

/* ---------------------------------------------------------------------------------------------- */
/*                                           BlockSwitch                                          */
/* ---------------------------------------------------------------------------------------------- */

type BlockSwitchPrpos = {
  id: string;
  type: string;
};

function BlockSwitch({ id, type }: BlockSwitchPrpos) {
  switch (type) {
    case "page": {
      return <PageBlock key={id} id={id} />;
    }
    case "paragraph": {
      return <ParagraphBlock key={id} id={id} />;
    }

    default: {
      console.error(`Unknown block type "${type}"`);
      return null;
    }
  }
}

/* ---------------------------------------------------------------------------------------------- */
/*                                         ParagraphBlock                                         */
/* ---------------------------------------------------------------------------------------------- */

type ParagraphBlockProps = {
  id: string;
};

function ParagraphBlock({ id }: ParagraphBlockProps) {
  useFetchBlockChildren(id);

  const block = useData(
    useCallback((state) => state.blocks[id], [id]),
    shallow
  );

  return block ? <Editable key={id} id={id} /> : null;
}

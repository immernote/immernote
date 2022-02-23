import { memo, useCallback } from "react";
import type { ReactNode } from "react";
import { add_block, replace_block } from "../actions/blocks";
import { useFetchBlockChildren } from "../hooks/fetch";
import { useData } from "../stores/data";
import { Layout } from "./layout";
import { v4 as uuid } from "@lukeed/uuid";
import { Editable } from "./editable";
import type { Block } from "../types";
import { dequal } from "dequal/lite";

/* ---------------------------------------------------------------------------------------------- */
/*                                          RootPageBlock                                         */
/* ---------------------------------------------------------------------------------------------- */

type RootPageBlockProps = {
  id: string;
  children: ReactNode;
};

export function RootPageBlock({ id, children }: RootPageBlockProps) {
  useFetchBlockChildren(id);

  const page = useData(
    useCallback(
      (state) => {
        const item = state.blocks[id] as Extract<Block, { type: "page" }> | undefined;
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
          {children}
          <div
            className="w-full cursor-text flex-grow h-32"
            onClick={async () => {
              await add_block<"paragraph">({
                id: uuid(),
                type: "paragraph",
                content: {
                  nodes: [{ type: "text", text: `Paragraph n. x` }],
                },
                format: {},
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

/* ------------------------------------ RootPageBlockChildren ----------------------------------- */

type RootPageBlockChildrenProps = {
  id: string;
  children: ReactNode;
};

export function RootPageBlockChildren({ id, children }: RootPageBlockChildrenProps) {
  const chldrn = useData(
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
    dequal
  );

  return (
    <>
      {chldrn.length > 0
        ? chldrn.map(([child_id, child_type]) => (
            <BlockSwitch key={child_id} id={child_id} type={child_type} />
          ))
        : children}
    </>
  );
}

/* ---------------------------------------------------------------------------------------------- */
/*                                            PageBlock                                           */
/* ---------------------------------------------------------------------------------------------- */

type PageBlockProps = {
  id: string;
};

export function PageBlock({ id }: PageBlockProps) {
  useFetchBlockChildren(id);

  const page = useData(
    useCallback((state) => state.blocks[id] as Extract<Block, { type: "page" }>, [id]),
    dequal
  );

  return page ? <div>Paragraph level {id}</div> : null;
}

/* ---------------------------------------------------------------------------------------------- */
/*                                           BlockSwitch                                          */
/* ---------------------------------------------------------------------------------------------- */

type BlockSwitchPrpos = {
  id: string;
  type: string;
};

const BlockSwitch = memo(function BlockSwitch({ id, type }: BlockSwitchPrpos) {
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
}, dequal);

/* ---------------------------------------------------------------------------------------------- */
/*                                         ParagraphBlock                                         */
/* ---------------------------------------------------------------------------------------------- */

type ParagraphBlockProps = {
  id: string;
};

function ParagraphBlock({ id }: ParagraphBlockProps) {
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

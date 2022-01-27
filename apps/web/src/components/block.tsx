import { useCallback, useEffect } from "react";
import { usePageBlock, usePageBlockChildren } from "../hooks/blocks";
import { useFetchBlockChildren } from "../hooks/fetch";
import { useData } from "../stores/data";
import { Layout } from "./layout";

type PageBlockProps = {
  id: string;
  root?: boolean;
};

export function PageBlock({ id, root = false }: PageBlockProps) {
  useFetchBlockChildren(id);
  const { data: page } = usePageBlock(id);
  const children = undefined;
  const blocks = useData((state) => state.blocks);
  useEffect(() => {
    console.log("Blocks", blocks);
  }, [blocks]);

  if (!page || !children) {
    return <div>Loading... </div>;
  }

  if (root) {
    return (
      <Layout title={page.content.title}>
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-x-4 pt-16 pb-8">
            <div className="text-4xl">{page.format.icon.value}</div>
            <h1 className="text-6xl tracking-tight font-medium">{page.content.title}</h1>
          </div>
          {/* {children.length > 0 ? (
            children.map((child) => <div>{child.id}</div>)
          ) : (
            <div className="text-gray11">Empty page. Click to start writing.</div>
          )} */}
        </div>
      </Layout>
    );
  }

  return <div>Paragraph level {id}</div>;
}

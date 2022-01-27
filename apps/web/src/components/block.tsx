import { usePageBlock, usePageBlockChildren } from "../hooks/blocks";

type PageBlockProps = {
  id: string;
  root?: boolean;
};

export function PageBlock({ id, root = false }: PageBlockProps) {
  const { data: page } = usePageBlock(id);
  const { data: children } = usePageBlockChildren(id);

  if (!page || !children) {
    return <div>Loading... </div>;
  }

  if (root) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-x-4 pt-16 pb-8">
          <div className="text-4xl">{page.format.icon.value}</div>
          <h1 className="text-6xl tracking-tight font-medium">{page.content.title}</h1>
        </div>
        {children?.map((child) => (
          <div>{child.id}</div>
        ))}
        <div contentEditable="true">Empty block</div>
      </div>
    );
  }

  return <div>Paragraph level {id}</div>;
}

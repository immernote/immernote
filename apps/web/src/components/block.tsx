import { usePageBlockChildren } from "../hooks/blocks";

type PageBlockProps = {
  id: string;
  root?: boolean;
};

export function PageBlock({ id, root = false }: PageBlockProps) {
  const { data: children } = usePageBlockChildren(id);

  if (root) {
    return (
      <div>
        <div>Top level {id}</div>
        {children?.map((child) => (
          <div>{child.id}</div>
        ))}
      </div>
    );
  }

  return <div>Paragraph level {id}</div>;
}

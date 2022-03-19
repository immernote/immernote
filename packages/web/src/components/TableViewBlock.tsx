import { useParams } from "react-router-dom";
import { add_block } from "../actions/add_block";
import { usePageBlocks, useViewBlock } from "../hooks/blocks";
import { v4 as uuid } from "@lukeed/uuid";
import { Plus } from "lucide-react";

type TableViewBlockProps = {
  id: string;
};

export default function TableViewBlock({ id }: TableViewBlockProps) {
  const { data: view } = useViewBlock<"table_view">(id);
  const { id: database_id } = useParams<{ id: string }>();
  const { data: pages } = usePageBlocks<"page">(database_id);

  async function handle_new_page() {
    if (!database_id) return;

    await add_block<"page">({
      id: uuid(),
      type: "page",
      content: {
        title: "New Page",
      },
      format: {
        icon: {
          type: "emoji",
          value: "🦄",
        },
      },
      parent_id: database_id,
    });
  }

  if (!view || !pages) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="w-full flex justify-between items-center">
        <div>View Name</div>
        <div>Actions</div>
      </div>
      <div className="grid grid-cols-12 divide-x-2 w-full border-gray6 border-t border-b">
        <div className="hover:bg-gray2 transition">Name</div>
        <button className="px-2 hover:bg-gray3 transition inline-flex items-center justify-center">
          <Plus className="h-[1em]" />
        </button>
      </div>
      <div>
        {pages.map((page) => (
          <div key={page.id}>{page.content.title}</div>
        ))}
      </div>
      <button
        className="w-full border-gray6 border-t border-b hover:bg-gray3 transition px-2 py-1 text-sm inline-flex items-center gap-x-1"
        onClick={handle_new_page}
      >
        <Plus className="h-[1em]" />
        <span>New</span>
      </button>
    </div>
  );
}

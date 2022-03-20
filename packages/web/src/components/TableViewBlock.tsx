import { useParams } from "react-router-dom";
import { usePageBlocks, useViewBlock } from "~/hooks/blocks";
import { v4 as uuid } from "@lukeed/uuid";
import { Plus } from "lucide-react";
import broadcast from "~/actions/broadcast";
import apply_transaction from "~/actions/apply_transaction";
import create_transaction from "~/actions/create_transaction";
import create_block from "~/actions/create_block";
import update_block from "~/actions/update_block";

type TableViewBlockProps = {
  id: string;
};

export default function TableViewBlock({ id }: TableViewBlockProps) {
  const { data: view } = useViewBlock<"table_view">(id);
  const { id: database_id } = useParams<{ id: string }>();
  const { data: pages } = usePageBlocks<"page">(database_id);

  async function handle_create_page() {
    if (!database_id) return;

    // await add_block<"page">({
    //   id: uuid(),
    //   type: "page",
    //   content: {
    //     title: "New Page",
    //   },
    //   format: {
    //     icon: {
    //       type: "emoji",
    //       value: "🦄",
    //     },
    //   },
    //   parent_id: database_id,
    // });

    broadcast(
      apply_transaction(
        create_transaction(
          create_block("page", {
            id: uuid(),
            content: {
              title: "New Page",
            },
            format: {
              icon: {
                type: "emoji",
                value: "🦄",
              },
            },
            root_page_id: "",
            space_id: "",
            children: [],
            created_by: "",
            modified_by: "",
            created_at: Date.now(),
            modified_at: Date.now(),
            deleted_at: null,
          })
        )
      )
    );
  }

  async function handle_create_field() {
    if (!database_id || !view) return;

    const field_id = uuid();

    broadcast(
      apply_transaction(
        create_transaction(
          create_block("text_field", {
            id: field_id,
            content: {},
            format: {},
            space_id: "",
            children: [],
            created_by: "",
            modified_by: "",
            created_at: Date.now(),
            modified_at: Date.now(),
            deleted_at: null,
          }),
          update_block("table_view", {
            id: view.id,
            content: { fields: [field_id] },
          })
        )
      )
    );

    // await add_block<"text_field">({
    //   id: field_id,
    //   type: "text_field",
    //   content: {},
    //   format: {},
    //   parent_id: database_id,
    // });

    // await replace_block<"table_view">({
    //   id: view.id,
    //   type: "table_view",
    //   content: { fields: [field_id] },
    //   format: view.format,
    // });
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
        <button
          className="px-2 hover:bg-gray3 transition inline-flex items-center justify-center"
          onClick={handle_create_field}
        >
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
        onClick={handle_create_page}
      >
        <Plus className="h-[1em]" />
        <span>New</span>
      </button>
    </div>
  );
}

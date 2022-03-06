import { v4 as uuid } from "@lukeed/uuid";
import { Plus } from "lucide-react";
import { add_block } from "../actions/add_block";
import { useCurrentSpace } from "../hooks/spaces";

export default function CreatePage() {
  const { data: space } = useCurrentSpace();

  async function handleClick() {
    if (!space) return;

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
      parent_id: null,
    });
  }

  return (
    <button
      className="tracking-tight transition hover:bg-gray3 px-4 py-2 text-sm text-left inline-flex items-center gap-x-2"
      onClick={handleClick}
    >
      <Plus className="h-[1em]" />
      <span>New Page</span>
    </button>
  );
}

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import { useCurrentSpace } from "../hooks/spaces";
import { useData } from "../stores/data";
import { Block } from "../types";
import { dequal } from "dequal/lite";

export default function Database({ level, id }: { id: string; level: number }) {
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
  const { data: space } = useCurrentSpace();
  const [expanded, set_expanded] = useState(false);
  const [has_focus, set_has_focus] = useState(false);
  const match = useMatch(":space/:id");
  const default_expanded = useData(
    useCallback(
      (state) => {
        const params_id = match?.params.id;
        if (!params_id) return false;
        if (id === params_id) return true;

        const block = state.blocks[params_id];
        if (!block) return false;
        // if (block.parent_pages_ids.indexOf(id) !== -1) return true;
        return false;
      },
      [match?.params.id]
    )
  );

  useEffect(() => {
    if (default_expanded) {
      set_expanded(true);
    }
  }, [default_expanded]);

  return database ? (
    <>
      <div
        className={clsx({
          "flex items-center justify-between px-4 transition hover:bg-gray4 group": true,
          "bg-gray4": has_focus,
        })}
        style={{
          paddingLeft: `${level / 2 + 1}rem`,
        }}
      >
        <button className="py-2 hover:bg-gray6 rounded" onClick={() => set_has_focus((v) => !v)}>
          {expanded ? <ChevronDown className="h-[1em]" /> : <ChevronRight className="h-[1em]" />}
        </button>
        <Link
          className="inline-flex items-center gap-x-2 flex-grow py-2"
          to={`/${space?.handle}/${id}`}
        >
          <span>{database.format.icon.value}</span>
          <span>{database.content.title ?? "Untitled"}</span>
        </Link>
        <div
          className={clsx({
            "inline-flex items-center gap-x-2 group-hover:visible py-2": true,
            visible: has_focus,
            invisible: !has_focus,
          })}
        >
          <DropdownMenu.Root onOpenChange={(v) => set_has_focus(v)}>
            <DropdownMenu.Trigger className="transition-all">
              <MoreHorizontal className="h-[1em]" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-gray1 border border-gray6 backdrop-blur-3xl rounded shadow-lg w-80">
              <DropdownMenu.Item className="text-xs text-gray11 tracking-tight bg-gray3 transition hover:bg-gray4 px-4 py-2 hover:outline-none">
                Delete
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-xs text-gray11 tracking-tight bg-gray3 transition hover:bg-gray4 px-4 py-2 hover:outline-none">
                Add to Favorites
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-xs text-gray11 tracking-tight bg-gray3 transition hover:bg-gray4 px-4 py-2 hover:outline-none">
                Duplicate
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-xs text-gray11 tracking-tight bg-gray3 transition hover:bg-gray4 px-4 py-2 hover:outline-none">
                Copy Link
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-xs text-gray11 tracking-tight bg-gray3 transition hover:bg-gray4 px-4 py-2 hover:outline-none">
                Rename
              </DropdownMenu.Item>
              <DropdownMenu.DropdownMenuSeparator className="h-px bg-gray7" />
              <DropdownMenu.Item className="text-xs text-gray11 tracking-tight bg-gray3 transition hover:bg-gray4 px-4 py-2 hover:outline-none">
                Move to
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          {/* <CreateSubPage page_id={page.id} /> */}
        </div>
      </div>
      {/* {expanded ? <Pages parent_page_id={id} level={level + 1} /> : null} */}
    </>
  ) : null;
}

import { v4 as uuid } from "@lukeed/uuid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import { add_block } from "../actions/add_block";
import { useFetchPageBlocks } from "../hooks/fetch";
import { useCurrentSpace } from "../hooks/spaces";
import { useData } from "../stores/data";
import { usePageBlock, usePageBlocks } from "../hooks/blocks";
import Database from "./SidebarDatabase";

export default function Pages(props: { parent_page_id?: string; level: number }) {
  useFetchPageBlocks(props.parent_page_id);
  const { data: pages } = usePageBlocks(props.parent_page_id);

  if (!pages) {
    return null;
  }

  if (props.parent_page_id) {
    if (pages.length === 0) {
      return (
        <div
          className="flex flex-col items-stretch w-full h-10 bg-gray2 text-gray11 px-4 py-2 text-xs"
          style={{ paddingLeft: `${props.level / 2 + 2}rem` }}
        >
          No pages.
        </div>
      );
    }

    return (
      <>
        {pages.map((page) =>
          page.id === props.parent_page_id ? null : page.type === "database" ? (
            <Database key={page.id} id={page.id} level={props.level} />
          ) : (
            <Page key={page.id} id={page.id} level={props.level} />
          )
        )}
      </>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-stretch w-full flex-grow min-h-[4rem] bg-gray2 text-gray11 px-4 py-4 text-xs">
        No pages.
      </div>
    );
  }

  return (
    <nav className="flex flex-col items-stretch w-full flex-grow min-h-[4rem] text-sm bg-gray2 overflow-y-auto">
      {pages.map((page) =>
        page.type === "database" ? (
          <Database key={page.id} id={page.id} level={props.level} />
        ) : (
          <Page key={page.id} id={page.id} level={props.level} />
        )
      )}
    </nav>
  );
}
function Page({ level, id }: { id: string; level: number }) {
  const { data: page } = usePageBlock(id);
  const { data: space } = useCurrentSpace();
  const [expanded, set_expanded] = useState(false);
  const [has_focus, set_has_focus] = useState(false);
  const match = useMatch(":space/:id");
  const default_expanded = useMemo(
    () => page?.root_page_id != null && page?.root_page_id === match?.params.id,
    [page?.root_page_id, match?.params.id]
  );

  useEffect(() => {
    if (default_expanded) {
      set_expanded(true);
    }
  }, [default_expanded]);

  return page ? (
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
        <button className="py-2 hover:bg-gray6 rounded" onClick={() => set_expanded((v) => !v)}>
          {expanded ? <ChevronDown className="h-[1em]" /> : <ChevronRight className="h-[1em]" />}
        </button>
        <Link
          className="inline-flex items-center gap-x-2 flex-grow py-2"
          to={`/${space?.handle}/${id}`}
        >
          <span>{page.format.icon.value}</span>
          <span>{page.content.title ?? "Untitled"}</span>
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
          <CreateSubPage page_id={page.id} />
        </div>
      </div>
      {expanded ? <Pages parent_page_id={id} level={level + 1} /> : null}
    </>
  ) : null;
}
function CreateSubPage({ page_id }: { page_id: string }) {
  const { data: space } = useCurrentSpace();

  async function handleClick() {
    if (!space) return;

    await add_block<"page">({
      id: uuid(),
      type: "page",
      content: {
        title: "New Sub Page",
      },
      format: {
        icon: {
          type: "emoji",
          value: "🦄",
        },
      },
      parent_id: page_id,
    });
  }

  return (
    <button onClick={handleClick}>
      <Plus className="h-[1em]" />
    </button>
  );
}

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronRight, ChevronsUpDown, MoreHorizontal, Plus, Search, Settings } from "lucide-react";
import { create_page_block } from "../actions/blocks";
import { usePageBlocks } from "../hooks/blocks";
import { useCurrentSpace, useSpaces } from "../hooks/spaces";
import { v4 as uuid } from "@lukeed/uuid";
import { useMemo, useState } from "react";
import { Block } from "../types";
import clsx from "clsx";
import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <div className="min-w-[calc(100%/5)] w-1/5 bg-gray3 text-gray11 h-screen flex flex-col items-stretch">
      <Workspaces />
      <Links />
      <Pages level={0} />
      <CreatePage />
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------- */
/*                                           Workspaces                                           */
/* ---------------------------------------------------------------------------------------------- */

function Workspaces() {
  return (
    <DropdownMenu.Root>
      <WorkspacesTrigger />
      <DropdownMenu.Content className="bg-gray1 border border-gray6 backdrop-blur-3xl rounded shadow-lg w-80">
        <WorkspacesList />
        <DropdownMenu.DropdownMenuSeparator className="h-px bg-gray7" />
        <DropdownMenu.Item className="text-xs text-gray11 tracking-tight bg-gray3 transition hover:bg-gray4 px-4 py-2 hover:outline-none">
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function WorkspacesTrigger() {
  const { data: space } = useCurrentSpace();

  return (
    <DropdownMenu.Trigger className="text-left font-medium tracking-tight transition hover:bg-gray4 px-4 py-4 text-sm focus:outline-none flex gap-x-4 items-center">
      <span>{space?.icon?.value}</span>
      <span>{space?.name}</span>
      <ChevronsUpDown className="h-[1em]" />
    </DropdownMenu.Trigger>
  );
}

function WorkspacesList() {
  const { data: spaces } = useSpaces();

  if (!spaces) {
    return null;
  }

  return (
    <>
      {spaces.map((space) => (
        <DropdownMenu.Item
          key={space.id}
          className="text-sm tracking-tight transition hover:bg-gray4 px-4 py-4 hover:outline-none flex items-center gap-x-4 focus:outline-none"
        >
          <span>{space.icon.value}</span>
          <span>{space.name}</span>
        </DropdownMenu.Item>
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------------------------------- */
/*                                              Links                                             */
/* ---------------------------------------------------------------------------------------------- */

function Links() {
  return (
    <>
      <div className="tracking-tight transition hover:bg-gray4 px-4 py-1 text-sm inline-flex items-center gap-x-2">
        <Search className="h-[1em]" />
        <span>Search</span>
      </div>
      <div className="tracking-tight transition hover:bg-gray4 px-4 py-1 text-sm inline-flex items-center gap-x-2">
        <Settings className="h-[1em]" />
        <span>Settings {"&"} Members</span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------------------------------- */
/*                                              Pages                                             */
/* ---------------------------------------------------------------------------------------------- */

function Pages(props: { parent_page_id?: string; level: number }) {
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
        {pages.map((page) => (
          <Page key={page.id} level={props.level} {...page} />
        ))}
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
      {pages.map((page) => (
        <Page key={page.id} level={props.level} {...page} />
      ))}
    </nav>
  );
}

function Page({ level, id, format, content }: Block & { level: number }) {
  const { data: space } = useCurrentSpace();
  const [expanded, setExpanded] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  return (
    <>
      <div
        className={clsx({
          "flex items-center justify-between px-4 transition hover:bg-gray4 group": true,
          "bg-gray4": hasFocus,
        })}
        style={{
          paddingLeft: `${level / 2 + 1}rem`,
        }}
      >
        <button className="py-2" onClick={() => setExpanded((v) => !v)}>
          <ChevronRight className="h-[1em]" />
        </button>
        <Link
          className="inline-flex items-center gap-x-2 flex-grow py-2"
          to={`/${space?.handle}/${id}`}
        >
          <span>{format.icon.value}</span>
          <span>{content.title ?? "Untitled"}</span>
        </Link>
        <div
          className={clsx({
            "inline-flex items-center gap-x-2 group-hover:visible py-2": true,
            visible: hasFocus,
            invisible: !hasFocus,
          })}
        >
          <DropdownMenu.Root onOpenChange={(v) => setHasFocus(v)}>
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
          <CreateSubPage id={id} />
        </div>
      </div>
      {expanded && <Pages parent_page_id={id} level={level + 1} />}
    </>
  );
}

function CreateSubPage({ id }: { id: string }) {
  const { data: space } = useCurrentSpace();
  const { mutate } = usePageBlocks(id);

  async function handleClick() {
    if (!space) return;

    await create_page_block(
      {
        id: uuid(),
        content: {
          title: ["New Sub Page"],
        },
        format: {
          icon: {
            type: "emoji",
            value: "🦄",
          },
        },
        parent_block_id: id,
        parent_page_id: id,
        space_id: space.id,
      },
      mutate
    );
  }

  return (
    <button onClick={handleClick}>
      <Plus className="h-[1em]" />
    </button>
  );
}

/* ---------------------------------------------------------------------------------------------- */
/*                                           CreatePage                                           */
/* ---------------------------------------------------------------------------------------------- */

function CreatePage() {
  const { data: space } = useCurrentSpace();
  const { mutate } = usePageBlocks();

  async function handleClick() {
    if (!space) return;

    await create_page_block(
      {
        id: uuid(),
        content: {
          title: ["New page"],
        },
        format: {
          icon: {
            type: "emoji",
            value: "🦄",
          },
        },
        parent_block_id: null,
        parent_page_id: null,
        space_id: space.id,
      },
      mutate
    );
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

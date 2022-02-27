import { v4 as uuid } from "@lukeed/uuid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import { add_block } from "../actions/blocks";
import { useFetchPageBlocks, useFetchSpaces } from "../hooks/fetch";
import { useCurrentSpace, useSpaces } from "../hooks/spaces";
import { useData } from "../stores/data";
import { Block } from "../types";
import { dequal } from "dequal/lite";

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
  useFetchSpaces();
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
  useFetchPageBlocks(props.parent_page_id);
  const pages = useData(
    useCallback(
      (state) =>
        state.pages[props.parent_page_id ?? "root"]?.map(
          (id) => [id, state.blocks[id]?.type] as const
        ),
      [props.parent_page_id]
    ),
    dequal
  );

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
        {pages.map(([page_id, page_type]) =>
          page_id === props.parent_page_id ? null : page_type === "database" ? (
            <Database key={page_id} id={page_id} level={props.level} />
          ) : (
            <Page key={page_id} id={page_id} level={props.level} />
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
      {pages.map(([page_id, page_type]) =>
        page_type === "database" ? (
          <Database key={page_id} id={page_id} level={props.level} />
        ) : (
          <Page key={page_id} id={page_id} level={props.level} />
        )
      )}
    </nav>
  );
}

function Page({ level, id }: { id: string; level: number }) {
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
        <button className="py-2 hover:bg-gray6 rounded" onClick={() => set_has_focus((v) => !v)}>
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

/* ------------------------------------------ Database ------------------------------------------ */

function Database({ level, id }: { id: string; level: number }) {
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

/* ---------------------------------------------------------------------------------------------- */
/*                                           CreatePage                                           */
/* ---------------------------------------------------------------------------------------------- */

function CreatePage() {
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

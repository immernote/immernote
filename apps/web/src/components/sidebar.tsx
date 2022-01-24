import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown, Plus, Search, Settings } from "lucide-react";
import { create_page_block } from "../actions/blocks";
import { usePageBlocks } from "../hooks/blocks";
import { useCurrentSpace, useSpaces } from "../hooks/spaces";
import { v4 as uuid } from "@lukeed/uuid";

export function Sidebar() {
  return (
    <div className="min-w-[calc(100%/5)] w-1/5 bg-gray3 text-gray11 h-screen flex flex-col items-stretch">
      <Workspaces />
      <Links />
      <Pages />
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

function Pages() {
  const { data: pages } = usePageBlocks();

  if (!pages) {
    return null;
  }

  if (pages.length === 0) {
    return (
      <nav className="flex flex-col items-stretch w-full flex-grow min-h-[4rem] bg-gray2 text-gray11 px-4 py-4 text-xs">
        No pages.
      </nav>
    );
  }

  return (
    <nav className="flex flex-col items-stretch w-full flex-grow min-h-[4rem] text-sm bg-gray2">
      {pages.map((page) => (
        <div key={page.id}>{page.content}</div>
      ))}
    </nav>
  );
}

function CreatePage() {
  const { data: space } = useCurrentSpace();

  async function handleClick() {
    if (!space) return;

    const [data, err] = await create_page_block({
      id: uuid(),
      content: "{}",
      format: "{}",
      parent_block_id: null,
      parent_page_id: null,
      space_id: space.id,
    });

    console.log(data, err);
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

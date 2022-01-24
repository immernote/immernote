import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { useSpaces } from "../hooks/spaces";

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

function Workspaces() {
  const { data: spaces } = useSpaces();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="text-left font-medium tracking-tight transition hover:bg-gray4 px-4 py-4 text-sm focus:outline-none flex gap-x-4 items-center">
        <div>{spaces?.[0].icon?.value}</div>
        <div>{spaces?.[0].name}</div>
        <ChevronsUpDown className="h-[1em]" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-gray1 border border-gray6 backdrop-blur-3xl rounded shadow-lg w-80">
        <DropdownMenu.Item className="text-sm tracking-tight transition hover:bg-gray4 px-4 py-4 hover:outline-none">
          Workspace 1
        </DropdownMenu.Item>
        <DropdownMenu.DropdownMenuSeparator className="h-px bg-gray7" />
        <DropdownMenu.Item className="text-xs text-gray11 tracking-tight bg-gray3 transition hover:bg-gray4 px-4 py-4 hover:outline-none">
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function Links() {
  return (
    <>
      <div className="tracking-tight transition hover:bg-gray4 px-4 py-1 text-sm">Search</div>
      <div className="tracking-tight transition hover:bg-gray4 px-4 py-1 text-sm">Settings</div>
    </>
  );
}

function Pages() {
  return (
    <nav className="flex flex-col items-stretch w-full flex-grow min-h-[4rem] text-sm bg-gray2">
      Loading...
    </nav>
  );
}

function CreatePage() {
  return (
    <button className="font-medium tracking-tight transition hover:bg-gray3 px-4 py-2 text-sm text-left">
      New Page
    </button>
  );
}

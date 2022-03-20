import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { useFetchSpaces } from "~/hooks/fetch";
import { useCurrentSpace, useSpaces } from "~/hooks/spaces";

export default function Workspaces() {
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

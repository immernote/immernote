import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect } from "react";
import axios from "redaxios";
import useSWR from "swr";
import { Space } from "../interfaces/space";

export function Sidebar() {
  return (
    <div className="min-w-[calc(100%/5)] w-1/5 bg-gray1 h-screen flex flex-col items-stretch">
      <Workspaces />
      <Links />
      <Pages />
      <CreatePage />
    </div>
  );
}

function Workspaces() {
  const { data: spaces } = useSWR("spaces", (key) =>
    axios<Space[]>("/api/v0/spaces").then(({ data }) => data)
  );

  useEffect(() => {
    console.log(spaces);
  });

  return (
    <div className="font-medium tracking-tight transition hover:bg-gray3 px-4 py-4 text-sm">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="focus:outline-none">Workspaces</DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-gray2 backdrop-blur-3xl rounded shadow-lg w-80">
          <DropdownMenu.Item className="transition bg-gray3 hover:bg-gray4 px-4 py-4 hover:outline-none">
            Workspace 1
          </DropdownMenu.Item>
          <DropdownMenu.Item className="transition bg-gray3 hover:bg-gray4 px-4 py-4 hover:outline-none">
            Workspace 2
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}

function Links() {
  return (
    <>
      <div className="font-medium tracking-tight transition hover:bg-gray3 px-4 py-1 text-sm">
        Search
      </div>
      <div className="font-medium tracking-tight transition hover:bg-gray3 px-4 py-1 text-sm">
        Settings
      </div>
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

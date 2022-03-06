import Workspaces from "./SidebarWorkspaces";
import Links from "./SidebarLinks";
import Pages from "./SidebarPages";
import CreatePage from "./SidebarCreatePage";

export default function Sidebar() {
  return (
    <div className="min-w-[calc(100%/5)] w-1/5 bg-gray3 text-gray11 h-screen flex flex-col items-stretch">
      <Workspaces />
      <Links />
      <Pages level={0} />
      <CreatePage />
    </div>
  );
}

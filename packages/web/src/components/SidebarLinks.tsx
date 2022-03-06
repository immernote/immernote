import { Search, Settings } from "lucide-react";

export default function Links() {
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

import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/sidebar";

export default function Root() {
  return (
    <div className="h-screen w-full tracking-tight flex items-center">
      <Sidebar />
      <main className="flex-grow h-screen w-full bg-slate-500">
        <Outlet />
      </main>
    </div>
  );
}

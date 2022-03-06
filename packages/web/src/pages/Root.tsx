import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useFetchUser } from "../hooks/fetch";
import { usePubSub } from "../hooks/pubsub";

export default function Root() {
  usePubSub();
  useFetchUser();

  return (
    <div className="h-screen w-full tracking-tight flex items-center">
      <Sidebar />
      <main className="flex-grow h-screen w-full bg-gray1">
        <Outlet />
      </main>
    </div>
  );
}

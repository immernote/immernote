import { Suspense } from "react";
import { SWRConfig } from "swr";
import { Routes } from "./routes";
import { useWs } from "./stores/ws";
import { fetcher } from "./utils/fetcher";

export function App() {
  useWs();

  return (
    <SWRConfig value={{ fetcher }}>
      <Suspense fallback={null}>
        <Routes />
      </Suspense>
    </SWRConfig>
  );
}

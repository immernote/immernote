import { Suspense } from "react";
import { SWRConfig } from "swr";
import { Routes } from "./routes";
import { fetcher } from "./utils/fetcher";

export function App() {
  return (
    <SWRConfig value={{ fetcher }}>
      <Suspense fallback={null}>
        <Routes />
      </Suspense>
    </SWRConfig>
  );
}

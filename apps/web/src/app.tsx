import { Suspense } from "react";
import { SWRConfig } from "swr";
import { Routes } from "./routes";
import { fetcher } from "./utils/fetcher";

export function App() {
  return (
    <Suspense fallback={null}>
      <SWRConfig value={{ fetcher }}>
        <Routes />
      </SWRConfig>
    </Suspense>
  );
}

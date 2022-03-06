import { Suspense } from "react";
import { SWRConfig } from "swr";
import { Routes } from "./routes";
import cache from "./utils/cache";
import { fetcher } from "./utils/fetcher";

export function App() {
  return (
    <SWRConfig value={{ fetcher, provider: () => cache }}>
      <Suspense fallback={null}>
        <Routes />
      </Suspense>
    </SWRConfig>
  );
}

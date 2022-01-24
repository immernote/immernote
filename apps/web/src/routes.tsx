import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes as RRRoutes } from "react-router-dom";
import { SWRConfig } from "swr";
import Root from "./pages/root";
import { fetcher } from "./utils/fetcher";

const Confirm = lazy(() => import("./pages/confirm"));
const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Page = lazy(() => import("./pages/page"));

export function Routes() {
  return (
    <Suspense fallback={null}>
      <SWRConfig value={{ fetcher }}>
        <BrowserRouter>
          <RRRoutes>
            <Route path="/" element={<Root />}>
              <Route index element={<Home />} />
              <Route path=":space/:id" element={<Page />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/confirm" element={<Confirm />} />
          </RRRoutes>
        </BrowserRouter>
      </SWRConfig>
    </Suspense>
  );
}

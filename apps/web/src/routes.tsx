import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes as RRRoutes } from "react-router-dom";

const App = lazy(() => import("./pages/_app"));
const Confirm = lazy(() => import("./pages/confirm"));
const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Page = lazy(() => import("./pages/page"));

export function Routes() {
	return (
		<Suspense fallback={null}>
			<BrowserRouter>
				<RRRoutes>
					<Route path="/" element={<App />}>
						<Route index element={<Home />} />
						<Route path=":id" element={<Page />} />
					</Route>
					<Route path="/login" element={<Login />} />
					<Route path="/confirm" element={<Confirm />} />
				</RRRoutes>
			</BrowserRouter>
		</Suspense>
	);
}

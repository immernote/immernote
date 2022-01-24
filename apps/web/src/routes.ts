import { lazy } from "solid-js";
import type { RouteDefinition } from "solid-app-router";

import AboutData from "./pages/about.data";

export const routes: RouteDefinition[] = [
	{
		path: "/",
		component: lazy(() => import("./pages/start")),
	},
	{
		path: "/home",
		component: lazy(() => import("./pages/home")),
	},
	{
		path: "/start",
		component: lazy(() => import("./pages/start")),
	},
	{
		path: "/login",
		component: lazy(() => import("./pages/login")),
	},
	{
		path: "/confirm",
		component: lazy(() => import("./pages/confirm")),
	},
	{
		path: "/about",
		component: lazy(() => import("./pages/about")),
		data: AboutData,
	},
	{
		path: "**",
		component: lazy(() => import("./pages/404")),
	},
];

import { useMemo } from "react";
import { matchPath } from "react-router-dom";

export function usePageID() {
  const { pathname } = window.location;
  const pattern = ":space/:id";
  return useMemo(() => matchPath(pattern, pathname)?.params.id, [pathname]);
}

export function useSpaceHandle() {
  const { pathname } = window.location;
  const pattern = ":space/:id";
  return useMemo(() => matchPath(pattern, pathname)?.params.space, [pathname]);
}

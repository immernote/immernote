import type { Draft } from "immer";
import produce from "immer";
import create from "zustand";
import type { DataStore } from "../types";

export const useData = create<DataStore>(() => ({
  spaces: {},
  blocks: {},
  pages: {},
  users: {},
  user: undefined,
}));

export const set = (fn: (draft: Draft<DataStore>) => void) => useData.setState(produce(fn));

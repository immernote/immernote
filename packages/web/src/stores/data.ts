import type { Draft } from "immer";
import produce from "immer";
import create from "zustand";
import { DataStore } from "~/types/DataStore";

export const useData = create<DataStore>(() => ({
  spaces: {},
  blocks: {},
  pages: {},
  users: {},
  user: undefined,
}));

export const set = (fn: (draft: Draft<DataStore>) => void) => useData.setState(produce(fn));

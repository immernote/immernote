import create from "zustand";
import produce from "immer";
import type { Draft } from "immer";
import type { DataStore } from "../types";

export const useData = create<DataStore>(() => ({
  spaces: {},
  blocks: {},
}));

export const set = (fn: (draft: Draft<DataStore>) => void) => useData.setState(produce(fn));

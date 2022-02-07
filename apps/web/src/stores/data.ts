import type { Draft, Patch } from "immer";
import produce from "immer";
import create from "zustand";
import type { DataStore, Msg } from "../types";
import { send } from "./msg";

export const useData = create<DataStore>(() => ({
  spaces: {},
  blocks: {},
  pages: {},
  users: {},
  user: undefined,
}));

export const set = (fn: (draft: Draft<DataStore>) => void) => useData.setState(produce(fn));

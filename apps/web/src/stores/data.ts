import type { Draft } from "immer";
import produce from "immer";
import create from "zustand";
import type { DataStore } from "../types";
import { send } from "./msg";

export const useData = create<DataStore>(() => ({
  spaces: {},
  blocks: {},
  pages: {},
}));

export const set = (fn: (draft: Draft<DataStore>) => void) => useData.setState(produce(fn));
export const patch = (fn: (draft: Draft<DataStore>) => void) =>
  useData.setState((state) => {
    const next = produce(state, fn, (patches, inverse_patches) => {
      // TODO: Add an undo/redo queue somewhere, using `inverse_patches`
      console.log(`Patches: `, JSON.stringify(patches, null, 2));
      send({
        type: "patch",
        data: patches as any,
      });
    });
    console.log(`Next: `, next);
  });

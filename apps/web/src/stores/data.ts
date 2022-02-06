import type { Draft, Patch } from "immer";
import produce from "immer";
import create from "zustand";
import type { DataStore, Msg } from "../types";
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
        data: stamp(patches, state),
      });
    });
    console.log(`Next: `, next);
  });

const mutable_ops = new Set(["replace", "remove", "move"]);

function stamp(patches: Patch[], state: DataStore): Msg["data"] {
  let stamped_patches = [];
  for (const patch of patches) {
    let stamped_patch: Msg["data"][number] = { ...patch };
    if (mutable_ops.has(patch.op)) {
      const id = patch.path[1] as string;
      const modified_at = state.blocks[id]?.modified_at;
      if (!modified_at) return [];
      stamped_patch.modified_at = modified_at;
    }

    stamped_patches.push(stamped_patch);
  }

  return stamped_patches;
}

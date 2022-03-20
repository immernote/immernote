import type { Cache } from "swr";
import { useData } from "~/stores/data";
import { Block } from "~/types/Block";

const get_table = (key: string) => {
  let [table] = key.replace("/api/v0/", "").replace(/\?.+/, "").split("/") as [string];
  if (table[table.length - 1] !== "s") {
    table = table + "s";
  }

  return table;
};

const h = new Map();

const cache: Cache = {
  get(key) {
    console.log(Date.now(), `[GET]    ${key}`);
    const _key = typeof key === "function" ? key() : key;
    if (!_key) return;

    const entry = h.get(_key);
    if (!entry || _key[0] === "$") return entry;

    // handle keys like `blocks/id`
    const table = get_table(_key) as "blocks";
    if (Array.isArray(entry)) {
      const expanded = new Array((entry as string[]).length);

      for (const [index, id] of (entry as string[]).entries()) {
        const value = useData.getState()[table][id];
        if (!value) return;
        expanded[index] = value;
      }

      return expanded;
    } else {
      return useData.getState()[table][entry as string];
    }
  },
  set(key, value) {
    console.log(Date.now(), `[SET]    ${key}`);
    const _key = typeof key === "function" ? key() : key;
    if (!_key) return;

    if (!value || _key[0] === "$") {
      h.set(_key, value);
      return;
    }

    const table = get_table(_key) as "blocks";

    if (Array.isArray(value)) {
      const items: Block[] = value;
      const ids = new Array(items.length);
      const tmp: { [k: string]: Block } = {};

      // Update store
      for (const [index, item] of items.entries()) {
        tmp[item.id] = item;
        ids[index] = item.id;
      }

      useData.setState((state) => ({ [table]: Object.assign({}, state[table], tmp) }));

      // Update map
      h.set(_key, ids);
    } else {
      const item: Block = value;

      // Update store
      useData.setState((state) => ({
        [table]: Object.assign({}, state[table], { [item.id]: item }),
      }));

      // Update map
      h.set(_key, item.id);
    }
  },
  delete(key) {
    const _key = typeof key === "function" ? key() : key;
    if (!_key) return;

    const entry = h.get(_key);
    if (entry || _key[0] === "$") {
      h.delete(_key);
      return;
    }

    // handle keys like `blocks/id`
    const table = get_table(_key) as "blocks";
    if (Array.isArray(entry)) {
      const tmp: { [k: string]: undefined } = {};

      for (const id of entry as string[]) {
        tmp[id] = undefined;
      }

      useData.setState((state) => ({ [table]: Object.assign({}, state[table], tmp) }));
    } else {
      useData.setState((state) => ({
        [table]: Object.assign({}, state[table], { [entry as string]: undefined }),
      }));
    }
  },
};

export default cache;

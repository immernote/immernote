import { set } from "~/stores/data";
import create_transaction from "./create_transaction";

export default function apply_transaction(tr: ReturnType<typeof create_transaction>) {
	console.log(JSON.stringify(tr, null, 2))
  set((draft) => {
    for (const item of tr.payload) {
      switch (item.type) {
        case "create_block": {
          draft.blocks[item.payload.id] = item.payload;
          break;
        }
        case "update_block": {
          if (draft.blocks[item.payload.id]) {
            // @ts-ignore
            draft.blocks[item.payload.id] = { ...draft.blocks[item.payload.id], ...item.payload };
          }
          break;
        }
        default: {
          // @ts-ignore
          console.error(`Unsupported transaction item type (${item.type})`);
        }
      }
    }
  });

  return tr;
}

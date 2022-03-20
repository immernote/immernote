import { useCallback } from "react";
import { ReactNode } from "react";
import { useData } from "~/stores/data";
import { dequal } from "dequal/lite";
import { BlockSwitch } from "./BlockSwitch";

type RootPageBlockChildrenProps = {
  id: string;
  children: ReactNode;
};

export function RootPageBlockChildren({ id, children }: RootPageBlockChildrenProps) {
  const chldrn = useData(
    useCallback(
      (state) => {
        const ids = state.blocks[id]?.children;
        if (!ids) return [];

        const list: [id: string, type: string][] = new Array(ids.length);
        for (const [index, item_id] of ids.entries()) {
          if (state.blocks[item_id])
            list[index] = [state.blocks[item_id]!.id, state.blocks[item_id]!.type];
        }

        return list;
      },
      [id]
    ),
    dequal
  );

  return (
    <>
      {chldrn.length > 0
        ? chldrn.map(([child_id, child_type]) => (
            <BlockSwitch key={child_id} id={child_id} type={child_type} />
          ))
        : children}
    </>
  );
}

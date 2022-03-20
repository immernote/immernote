import { lazy, memo } from "react";
import { dequal } from "dequal/lite";

const blocks_map = {
  page: lazy(() => import("./PageBlock")),
  paragraph: lazy(() => import("./ParagraphBlock")),
  database: lazy(() => import("./DatabaseBlock")),
  // field: lazy(() => import("./PageBlock")),
  // view: lazy(() => import("./PageBlock")),
  table_view: lazy(() => import("./PageBlock")),
};

type BlockSwitchPrpos = {
  id: string;
  type: keyof typeof blocks_map;
};

export const BlockSwitch = memo(function BlockSwitch({ id, type }: BlockSwitchPrpos) {
  const Comp = blocks_map[type];
  return <Comp key={id} id={id} />;
}, dequal);

export default BlockSwitch;

import { lazy, memo } from "react";
import { dequal } from "dequal/lite";

const views_map = {
  view: lazy(() => import("./PageBlock")),
  table_view: lazy(() => import("./TableViewBlock")),
};

type ViewSwitchPrpos = {
  id: string;
  type: keyof typeof views_map;
};

const ViewSwitch = memo(function ViewSwitch({ id, type }: ViewSwitchPrpos) {
  const Comp = views_map[type];
  return <Comp key={id} id={id} />;
}, dequal);

export default ViewSwitch;

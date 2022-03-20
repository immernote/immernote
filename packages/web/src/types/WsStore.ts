import Sockette from "sockette";

/* ---------------------------------------------------------------------------------------------- */
/*                                             WsStore                                            */
/* ---------------------------------------------------------------------------------------------- */

export type WsStore = {
  is_ready: boolean;
  ws: undefined | Sockette;
};
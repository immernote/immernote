import create from "zustand";
import { WsStore } from "~/types/WsStore";

export const useWs = create<WsStore>(() => ({
  is_ready: false,
  ws: undefined,
}));

export const set_ws = (ws: WsStore["ws"]) => useWs.setState({ ws });
export const set_is_ready = (is_ready: WsStore["is_ready"]) => useWs.setState({ is_ready });

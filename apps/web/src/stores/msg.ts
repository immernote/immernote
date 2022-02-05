import type { GetState, SetState, StoreApi } from "zustand";
import create from "zustand";
import { persist } from "zustand/middleware";
import type { Msg, MsgStore } from "../types";
import { useWs } from "./ws";

export const useMsg = create(
  persist<MsgStore, SetState<MsgStore>, GetState<MsgStore>, StoreApi<MsgStore>>(
    () => ({
      queue: [],
    }),
    {
      name: "immernote-msg",
    }
  )
);

export const send = (msg: Msg) =>
  useMsg.setState((state) => {
    const ws_state = useWs.getState();
    if (!ws_state.is_ready || !ws_state.ws) {
      return {
        queue: [...state.queue, msg],
      };
    }

    if (state.queue.length > 0) {
      for (const item of state.queue) {
        ws_state.ws.json(item);
      }
    }

    ws_state.ws.json(msg);

    return { queue: [] };
  });

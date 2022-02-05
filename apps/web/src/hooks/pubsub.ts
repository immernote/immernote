import { useCallback, useEffect } from "react";
import Sockette from "sockette";
import { useData } from "../stores/data";
import { set_is_ready, set_ws, useWs } from "../stores/ws";
import { useSpaceHandle } from "./params";

const WS_HOST = import.meta.env.VITE_WS_HOST as string;

export function usePubSub() {
  const ws = useWs(useCallback((state) => state.ws, []));
  const space_handle = useSpaceHandle();
  const space_id = useData(
    useCallback(
      (state) =>
        space_handle
          ? Object.values(state.spaces).find((space) => space.handle === space_handle)?.id
          : undefined,
      [space_handle]
    )
  );

  useEffect(() => {
    if (!space_id) {
      return;
    }

    const socket = new Sockette(`${WS_HOST}/api/ws?space_id=${space_id}`, {
      timeout: 5e3,
      onopen() {
        console.log("[MULTIPLAYER]:\tConnected");
        set_is_ready(true);
      },
      onmessage({ data }: { data: string }) {
        console.log(data);
      },
      onreconnect() {
        console.log("[MULTIPLAYER]:\tReconnecting");
        set_is_ready(false);
      },
      onmaximum(e) {
        console.log("[MULTIPLAYER]:\tStop Attempting!", e);
      },
      onclose() {
        console.log("[MULTIPLAYER]:\tClosed");
        set_is_ready(false);
      },
      onerror(e) {
        console.log("[MULTIPLAYER]:\tError", e);
        set_is_ready(false);
      },
    });

    set_ws(socket);

    return () => {
      socket.close();
      ws?.close();
      set_is_ready(false);
      set_ws(undefined);
    };
  }, [space_id]);
}

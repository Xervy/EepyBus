import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";
import { isAlarmActive, startAlarm, stopAlarm } from "../services/tracking";
import { getCurrentCoords } from "../services/location";
import { setupAlarmChannel } from "../services/notifications";
import { ensureAlarmPermissions } from "../services/permissions";
import type { Destination, Result } from "../types";
import { distanceMeters } from "../utils/distance";

export function useAlarm() {
  const [active, setActive] = useState(false);

  // The alarm can stop itself in the background, so re-sync with reality.
  const refresh = useCallback(async () => {
    setActive(await isAlarmActive());
  }, []);

  useEffect(() => {
    setupAlarmChannel();
    refresh();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  const arm = useCallback(
    async (destination: Destination, radiusMeters: number): Promise<Result> => {
      try {
        const perms = await ensureAlarmPermissions();
        if (!perms.ok) return perms;

        // Geofences only fire on *entering*, so starting inside would never alert.
        const here = await getCurrentCoords();
        if (distanceMeters(here, destination) <= radiusMeters) {
          return {
            ok: false,
            reason: "You're already inside the alarm radius.",
          };
        }

        await startAlarm(destination, radiusMeters);
        setActive(true);
        return { ok: true };
      } catch (e) {
        return {
          ok: false,
          reason: e instanceof Error ? e.message : "Couldn't start the alarm.",
        };
      }
    },
    [],
  );

  const cancel = useCallback(async () => {
    await stopAlarm();
    setActive(false);
  }, []);

  return { active, arm, cancel };
}

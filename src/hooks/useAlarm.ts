import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";
import { loadAlarmConfig, type AlarmConfig } from "../services/alarmStorage";
import { getCurrentCoords } from "../services/location";
import { setupAlarmChannel } from "../services/notifications";
import { ensureAlarmPermissions } from "../services/permissions";
import { isAlarmActive, startAlarm, stopAlarm } from "../services/tracking";
import type { Destination, Result } from "../types";
import { distanceMeters } from "../utils/distance";

export function useAlarm() {
  const [active, setActive] = useState(false);
  // The destination and radius of the running alarm (null when inactive).
  const [config, setConfig] = useState<AlarmConfig | null>(null);

  // The alarm can stop itself in the background, so re-sync with reality.
  const refresh = useCallback(async () => {
    const isActive = await isAlarmActive();
    setActive(isActive);
    setConfig(isActive ? await loadAlarmConfig() : null);
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

        // Refuse if you're already inside the radius: the alarm would fire
        // immediately, or look like it's working when you've missed your stop.
        const here = await getCurrentCoords();
        if (distanceMeters(here, destination) <= radiusMeters) {
          return {
            ok: false,
            reason: "You're already inside the alarm radius.",
          };
        }

        await startAlarm(destination, radiusMeters);
        setActive(true);
        setConfig({ destination, radiusMeters });
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
    setConfig(null);
  }, []);

  return { active, config, arm, cancel };
}

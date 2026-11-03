import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import type { Result } from "../types";

/** Foreground-only permission: enough to show the map and your position. */
export async function ensureForegroundLocation(): Promise<boolean> {
  const fg = await Location.requestForegroundPermissionsAsync();
  return fg.status === "granted";
}

/**
 * Makes sure everything the alarm needs is granted.
 * Foreground location must be granted before background can be requested.
 */
export async function ensureAlarmPermissions(): Promise<Result> {
  if (!(await ensureForegroundLocation())) {
    return { ok: false, reason: "Location access is required." };
  }

  const bg = await Location.requestBackgroundPermissionsAsync();
  if (bg.status !== "granted") {
    return {
      ok: false,
      reason:
        'Choose "Allow all the time" for location so the alarm works while your phone is locked.',
    };
  }

  const notif = await Notifications.requestPermissionsAsync();
  if (!notif.granted) {
    return { ok: false, reason: "Notifications are required to wake you up." };
  }

  return { ok: true };
}

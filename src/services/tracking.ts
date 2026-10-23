import * as Location from "expo-location";
import { LOCATION_TASK_NAME } from "../constants";
import type { Destination } from "../types";
import { clearAlarmConfig, saveAlarmConfig } from "./alarmStorage";

export async function startAlarm(destination: Destination, radiusMeters: number) {
  await saveAlarmConfig({ destination, radiusMeters });

  try {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      distanceInterval: 100, // meters moved before a new update
      timeInterval: 15000, // Android: at most one update per 15 s
      pausesUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
      // Android: keeps tracking alive while the phone is locked.
      foregroundService: {
        notificationTitle: "EepyBus alarm is on",
        notificationBody: "Watching for your stop. You can sleep.",
        killServiceOnDestroy: false,
      },
    });
  } catch (e) {
    await clearAlarmConfig();
    throw e;
  }
}

export async function stopAlarm() {
  if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
  await clearAlarmConfig();
}

export function isAlarmActive() {
  return Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
}

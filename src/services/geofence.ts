import * as Location from "expo-location";
import { GEOFENCE_REGION_ID, GEOFENCE_TASK_NAME } from "../constants";
import type { Destination } from "../types";

export function startAlarm(destination: Destination, radiusMeters: number) {
  return Location.startGeofencingAsync(GEOFENCE_TASK_NAME, [
    {
      identifier: GEOFENCE_REGION_ID,
      latitude: destination.latitude,
      longitude: destination.longitude,
      radius: radiusMeters,
      notifyOnEnter: true,
      notifyOnExit: false,
    },
  ]);
}

export function stopAlarm() {
  return Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
}

export function isAlarmActive() {
  return Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME);
}

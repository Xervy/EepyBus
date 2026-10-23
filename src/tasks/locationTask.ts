import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { LOCATION_TASK_NAME, MAX_ACCEPTABLE_ACCURACY_M } from "../constants";
import { loadAlarmConfig } from "../services/alarmStorage";
import { sendWakeUpAlert } from "../services/notifications";
import { stopAlarm } from "../services/tracking";
import { distanceMeters } from "../utils/distance";

type LocationTaskData = {
  locations: Location.LocationObject[];
};

// This file must be imported at the very top of index.ts so the task is
// registered even when the OS launches the app in the background.
TaskManager.defineTask<LocationTaskData>(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.error("Location task error:", error);
      return;
    }

    const config = await loadAlarmConfig();
    if (!config) {
      // Tracking is running but no alarm is configured: shut it down so the
      // foreground notification doesn't linger forever.
      await stopAlarm();
      return;
    }

    const latest = data.locations[data.locations.length - 1];
    if (!latest) return;

    const accuracy = latest.coords.accuracy;
    if (accuracy != null && accuracy > MAX_ACCEPTABLE_ACCURACY_M) return;

    if (distanceMeters(latest.coords, config.destination) <= config.radiusMeters) {
      await sendWakeUpAlert();
      await stopAlarm(); // one-shot
    }
  },
);

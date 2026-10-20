import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { GEOFENCE_TASK_NAME } from "../constants";
import { sendWakeUpAlert } from "../services/notifications";
import { stopAlarm } from "../services/geofence";

type GeofenceTaskData = {
  eventType: Location.GeofencingEventType;
  region: Location.LocationRegion;
};


TaskManager.defineTask<GeofenceTaskData>(
  GEOFENCE_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.error("Geofence task error:", error);
      return;
    }

    if (data.eventType === Location.GeofencingEventType.Enter) {
      await sendWakeUpAlert();
      await stopAlarm();                                            // don't re-trigger
    }
  },
);
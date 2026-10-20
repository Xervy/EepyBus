export const GEOFENCE_TASK_NAME = "TRANSIT_ALARM_GEOFENCE_TASK";
export const GEOFENCE_REGION_ID = "DESTINATION";

export const ALARM_CHANNEL_ID = "alarm";

export const DEFAULT_RADIUS_M = 400;

// Temporary: replace once the map screen lets the user pick a destination.
// Make sure this is a few km from where you are testing, or you'll start
// inside the region and the "enter" event will never fire.
export const TEST_DESTINATION = {
  latitude: 49.2606,
  longitude: -123.246,
};

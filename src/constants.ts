export const LOCATION_TASK_NAME = "TRANSIT_ALARM_LOCATION_TASK";
export const ALARM_STORAGE_KEY = "eepybus.activeAlarm";

export const ALARM_CHANNEL_ID = "alarm";

export const DEFAULT_RADIUS_M = 1000;

// Ignore location fixes that are less accurate than this. Cell-tower fixes can
// be off by kilometers and would trigger the alarm too early.
export const MAX_ACCEPTABLE_ACCURACY_M = 300;

// Temporary: replace once the map screen lets the user pick a destination.
export const TEST_DESTINATION = {
  latitude: 49.2606,
  longitude: -123.246,
};

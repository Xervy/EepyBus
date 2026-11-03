export const LOCATION_TASK_NAME = "TRANSIT_ALARM_LOCATION_TASK";
export const ALARM_STORAGE_KEY = "eepybus.activeAlarm";

export const ALARM_CHANNEL_ID = "alarm";

export const RADIUS_OPTIONS_M = [500, 750, 1000, 1500, 2000, 3000];
export const DEFAULT_RADIUS_M = 1000;

// Ignore location fixes that are less accurate than this. Cell-tower fixes can
// be off by kilometers and would trigger the alarm too early.
export const MAX_ACCEPTABLE_ACCURACY_M = 300;

// Where the map starts if the phone has no location yet (and where it is
// centered if location permission is denied).
export const DEFAULT_MAP_CENTER = {
  latitude: 49.2606,
  longitude: -123.246,
};

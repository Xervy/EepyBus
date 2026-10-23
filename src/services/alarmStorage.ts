import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALARM_STORAGE_KEY } from "../constants";
import type { Destination } from "../types";

// The background task runs without the React app, so it can't read component
// state. The active alarm's settings are stored on disk for it to read.
export type AlarmConfig = {
  destination: Destination;
  radiusMeters: number;
};

export async function saveAlarmConfig(config: AlarmConfig) {
  await AsyncStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(config));
}

export async function loadAlarmConfig(): Promise<AlarmConfig | null> {
  const raw = await AsyncStorage.getItem(ALARM_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AlarmConfig) : null;
}

export async function clearAlarmConfig() {
  await AsyncStorage.removeItem(ALARM_STORAGE_KEY);
}

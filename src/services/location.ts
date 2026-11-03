import * as Location from "expo-location";
import type { Destination } from "../types";

function toDestination(pos: Location.LocationObject): Destination {
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

export async function getCurrentCoords(): Promise<Destination> {
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return toDestination(pos);
}

/** Instant but possibly stale; null if the phone has no cached position. */
export async function getLastKnownCoords(): Promise<Destination | null> {
  const pos = await Location.getLastKnownPositionAsync();
  return pos ? toDestination(pos) : null;
}

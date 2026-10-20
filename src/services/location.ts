import * as Location from "expo-location";
import type { Destination } from "../types";

export async function getCurrentCoords(): Promise<Destination> {
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

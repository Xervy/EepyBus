/** 500 -> "500 m", 1000 -> "1 km", 1500 -> "1.5 km". */
export function formatDistance(meters: number): string {
  return meters >= 1000 ? `${meters / 1000} km` : `${meters} m`;
}

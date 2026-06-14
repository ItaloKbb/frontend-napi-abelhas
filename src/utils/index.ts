/**
 * Formats an ISO date string to a localised Brazilian date (dd/mm/yyyy).
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("pt-BR");
}

/**
 * Formats an ISO date string to a localised Brazilian datetime (dd/mm/yyyy HH:mm).
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats a pair of coordinates to a human-readable string.
 */
export function formatCoordinates(
  latitude: number,
  longitude: number
): string {
  const lat = Math.abs(latitude).toFixed(6);
  const lng = Math.abs(longitude).toFixed(6);
  const latDir = latitude >= 0 ? "N" : "S";
  const lngDir = longitude >= 0 ? "L" : "O";
  return `${lat}°${latDir} ${lng}°${lngDir}`;
}

/**
 * Returns a Google Maps URL for the given coordinates.
 */
export function buildMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

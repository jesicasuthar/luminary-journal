import { LocationData } from '../types';

export const INSPIRATIONAL_SANCTUARIES: LocationData[] = [
  { name: 'Home Sanctuary & Reading Nook', address: 'Private Haven' },
  { name: 'Old Town Café & Paper Shop', address: 'Corner of Rue de Fleurus' },
  { name: 'Philosopher’s Path', address: 'Kyoto, Japan', lat: 35.0275, lng: 135.7958 },
  { name: 'Misty Pine Forest Trail', address: 'Cascade Range', lat: 45.3736, lng: -121.6960 },
  { name: 'Coastal Sea Cliffs & Lighthouse', address: 'Big Sur, California', lat: 36.3615, lng: -121.8563 },
  { name: 'Botanical Conservatory & Glasshouse', address: 'Historic Gardens' },
  { name: 'Late Night Library Attic', address: 'Archives & Books' }
];

/**
 * Searches or verifies a location via server geocoding endpoint or falls back safely.
 */
export async function searchLocation(query: string): Promise<LocationData[]> {
  if (!query.trim()) return INSPIRATIONAL_SANCTUARIES;

  try {
    const res = await fetch(`/api/maps/geocode?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (err) {
    console.warn('Geocoding endpoint error:', err);
  }

  // Filter inspirational or format query as custom location
  const filtered = INSPIRATIONAL_SANCTUARIES.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) || 
    (s.address && s.address.toLowerCase().includes(query.toLowerCase()))
  );

  if (filtered.length > 0) return filtered;

  return [
    {
      name: query.trim(),
      address: 'Custom Journal Location'
    }
  ];
}

/**
 * Gets user's current coordinates safely via browser Geolocation API
 */
export function getCurrentBrowserCoordinates(): Promise<{ lat: number; lng: number } | null> {
  return new Promise(resolve => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        resolve({
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4))
        });
      },
      () => resolve(null),
      { timeout: 8000, enableHighAccuracy: false }
    );
  });
}

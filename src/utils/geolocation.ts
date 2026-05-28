/**
 * Geolocation utility functions.
 * Wraps the browser Geolocation API with error handling and graceful degradation.
 */

export interface GeoPosition {
  lat: number;
  lng: number;
}

export interface GeolocationResult {
  position: GeoPosition | null;
  error: string | null;
}

/**
 * Error messages in Brazilian Portuguese for geolocation failures.
 */
export const GEOLOCATION_ERRORS = {
  PERMISSION_DENIED: 'Localização indisponível. Busque por CEP ou cidade.',
  POSITION_UNAVAILABLE: 'Localização indisponível. Busque por CEP ou cidade.',
  TIMEOUT: 'Localização indisponível. Busque por CEP ou cidade.',
  NOT_SUPPORTED: 'Localização indisponível. Busque por CEP ou cidade.',
} as const;

/**
 * Checks if the Geolocation API is available in the current browser.
 */
export function isGeolocationAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

/**
 * Requests the user's current position from the browser Geolocation API.
 * Returns a promise that resolves with the position or an error message.
 */
export function getCurrentPosition(
  options?: PositionOptions
): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    if (!isGeolocationAvailable()) {
      resolve({
        position: null,
        error: GEOLOCATION_ERRORS.NOT_SUPPORTED,
      });
      return;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes cache
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          error: null,
        });
      },
      (error) => {
        let errorMessage: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = GEOLOCATION_ERRORS.PERMISSION_DENIED;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = GEOLOCATION_ERRORS.POSITION_UNAVAILABLE;
            break;
          case error.TIMEOUT:
            errorMessage = GEOLOCATION_ERRORS.TIMEOUT;
            break;
          default:
            errorMessage = GEOLOCATION_ERRORS.NOT_SUPPORTED;
        }

        resolve({
          position: null,
          error: errorMessage,
        });
      },
      defaultOptions
    );
  });
}

/**
 * Maps a geolocation error code to a user-friendly message.
 */
export function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return GEOLOCATION_ERRORS.PERMISSION_DENIED;
    case error.POSITION_UNAVAILABLE:
      return GEOLOCATION_ERRORS.POSITION_UNAVAILABLE;
    case error.TIMEOUT:
      return GEOLOCATION_ERRORS.TIMEOUT;
    default:
      return GEOLOCATION_ERRORS.NOT_SUPPORTED;
  }
}

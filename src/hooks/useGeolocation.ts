import { useState, useCallback } from 'react';
import {
  isGeolocationAvailable,
  GEOLOCATION_ERRORS,
  type GeoPosition,
} from '../utils/geolocation';

export interface GeolocationState {
  position: { lat: number; lng: number } | null;
  error: string | null;
  isLoading: boolean;
  isPermissionDenied: boolean;
}

/**
 * Custom hook that wraps the browser Geolocation API.
 * Handles permission states, errors, and loading.
 * Does NOT auto-request on mount — waits for user action via requestLocation.
 */
export function useGeolocation(): GeolocationState & { requestLocation: () => void } {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    isLoading: false,
    isPermissionDenied: false,
  });

  const requestLocation = useCallback(() => {
    if (!isGeolocationAvailable()) {
      setState({
        position: null,
        error: GEOLOCATION_ERRORS.NOT_SUPPORTED,
        isLoading: false,
        isPermissionDenied: false,
      });
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      isPermissionDenied: false,
    }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position: GeoPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setState({
          position,
          error: null,
          isLoading: false,
          isPermissionDenied: false,
        });
      },
      (error) => {
        let errorMessage: string;
        let permissionDenied = false;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = GEOLOCATION_ERRORS.PERMISSION_DENIED;
            permissionDenied = true;
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

        setState({
          position: null,
          error: errorMessage,
          isLoading: false,
          isPermissionDenied: permissionDenied,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  return {
    ...state,
    requestLocation,
  };
}

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGeolocation } from './useGeolocation';
import { GEOLOCATION_ERRORS } from '../utils/geolocation';

describe('useGeolocation', () => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default state and not auto-request', () => {
    const { result } = renderHook(() => useGeolocation());

    expect(result.current.position).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPermissionDenied).toBe(false);
    expect(mockGeolocation.getCurrentPosition).not.toHaveBeenCalled();
  });

  it('should set isLoading to true when requestLocation is called', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {
      // Never resolves — simulates pending state
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestLocation();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should return position on successful geolocation', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation(
      (success: PositionCallback) => {
        success({
          coords: {
            latitude: -23.5505,
            longitude: -46.6333,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as GeolocationPosition);
      }
    );

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      result.current.requestLocation();
    });

    expect(result.current.position).toEqual({
      lat: -23.5505,
      lng: -46.6333,
    });
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPermissionDenied).toBe(false);
  });

  it('should handle permission denied error', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        error({
          code: 1, // PERMISSION_DENIED
          message: 'User denied Geolocation',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError);
      }
    );

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      result.current.requestLocation();
    });

    expect(result.current.position).toBeNull();
    expect(result.current.error).toBe(GEOLOCATION_ERRORS.PERMISSION_DENIED);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPermissionDenied).toBe(true);
  });

  it('should handle position unavailable error', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        error({
          code: 2, // POSITION_UNAVAILABLE
          message: 'Position unavailable',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError);
      }
    );

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      result.current.requestLocation();
    });

    expect(result.current.position).toBeNull();
    expect(result.current.error).toBe(GEOLOCATION_ERRORS.POSITION_UNAVAILABLE);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPermissionDenied).toBe(false);
  });

  it('should handle timeout error', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        error({
          code: 3, // TIMEOUT
          message: 'Timeout',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError);
      }
    );

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      result.current.requestLocation();
    });

    expect(result.current.position).toBeNull();
    expect(result.current.error).toBe(GEOLOCATION_ERRORS.TIMEOUT);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPermissionDenied).toBe(false);
  });

  it('should handle geolocation API not available', async () => {
    // Remove the geolocation property entirely so 'geolocation' in navigator is false
    const originalDescriptor = Object.getOwnPropertyDescriptor(navigator, 'geolocation');
    // @ts-expect-error - deleting for test purposes
    delete navigator.geolocation;

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      result.current.requestLocation();
    });

    expect(result.current.position).toBeNull();
    expect(result.current.error).toBe(GEOLOCATION_ERRORS.NOT_SUPPORTED);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPermissionDenied).toBe(false);

    // Restore
    if (originalDescriptor) {
      Object.defineProperty(navigator, 'geolocation', originalDescriptor);
    }
  });

  it('should allow re-requesting location after an error', async () => {
    // First call: error
    mockGeolocation.getCurrentPosition.mockImplementationOnce(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        error({
          code: 3,
          message: 'Timeout',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError);
      }
    );

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      result.current.requestLocation();
    });

    expect(result.current.error).toBe(GEOLOCATION_ERRORS.TIMEOUT);

    // Second call: success
    mockGeolocation.getCurrentPosition.mockImplementationOnce(
      (success: PositionCallback) => {
        success({
          coords: {
            latitude: -22.9068,
            longitude: -43.1729,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as GeolocationPosition);
      }
    );

    await act(async () => {
      result.current.requestLocation();
    });

    expect(result.current.position).toEqual({
      lat: -22.9068,
      lng: -43.1729,
    });
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});

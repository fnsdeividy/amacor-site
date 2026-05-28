import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  it('should initialize with page 1', () => {
    const { result } = renderHook(() => usePagination(100));
    expect(result.current.currentPage).toBe(1);
  });

  it('should compute totalPages correctly', () => {
    const { result } = renderHook(() => usePagination(100));
    expect(result.current.totalPages).toBe(5); // 100 / 20 = 5
  });

  it('should compute totalPages with partial last page', () => {
    const { result } = renderHook(() => usePagination(45));
    expect(result.current.totalPages).toBe(3); // ceil(45 / 20) = 3
  });

  it('should return 0 totalPages for 0 items', () => {
    const { result } = renderHook(() => usePagination(0));
    expect(result.current.totalPages).toBe(0);
  });

  it('should use default page size of 20', () => {
    const { result } = renderHook(() => usePagination(40));
    expect(result.current.totalPages).toBe(2);
  });

  it('should accept custom page size', () => {
    const { result } = renderHook(() => usePagination(40, 10));
    expect(result.current.totalPages).toBe(4);
  });

  it('should compute startIndex and endIndex for page 1', () => {
    const { result } = renderHook(() => usePagination(50));
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(20);
  });

  it('should compute endIndex clamped to totalItems on last page', () => {
    const { result } = renderHook(() => usePagination(45));
    act(() => {
      result.current.goToPage(3);
    });
    expect(result.current.startIndex).toBe(40);
    expect(result.current.endIndex).toBe(45);
  });

  describe('goToPage', () => {
    it('should navigate to a valid page', () => {
      const { result } = renderHook(() => usePagination(100));
      act(() => {
        result.current.goToPage(3);
      });
      expect(result.current.currentPage).toBe(3);
    });

    it('should clamp to 1 when page is below range', () => {
      const { result } = renderHook(() => usePagination(100));
      act(() => {
        result.current.goToPage(0);
      });
      expect(result.current.currentPage).toBe(1);
    });

    it('should clamp to 1 when page is negative', () => {
      const { result } = renderHook(() => usePagination(100));
      act(() => {
        result.current.goToPage(-5);
      });
      expect(result.current.currentPage).toBe(1);
    });

    it('should clamp to totalPages when page exceeds range', () => {
      const { result } = renderHook(() => usePagination(100));
      act(() => {
        result.current.goToPage(10);
      });
      expect(result.current.currentPage).toBe(5);
    });
  });

  describe('nextPage', () => {
    it('should advance to next page', () => {
      const { result } = renderHook(() => usePagination(100));
      act(() => {
        result.current.nextPage();
      });
      expect(result.current.currentPage).toBe(2);
    });

    it('should not go beyond totalPages', () => {
      const { result } = renderHook(() => usePagination(100));
      act(() => {
        result.current.goToPage(5);
      });
      act(() => {
        result.current.nextPage();
      });
      expect(result.current.currentPage).toBe(5);
    });
  });

  describe('prevPage', () => {
    it('should go to previous page', () => {
      const { result } = renderHook(() => usePagination(100));
      act(() => {
        result.current.goToPage(3);
      });
      act(() => {
        result.current.prevPage();
      });
      expect(result.current.currentPage).toBe(2);
    });

    it('should not go below page 1', () => {
      const { result } = renderHook(() => usePagination(100));
      act(() => {
        result.current.prevPage();
      });
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('reset on totalItems change', () => {
    it('should reset to page 1 when totalItems changes', () => {
      const { result, rerender } = renderHook(
        ({ totalItems }) => usePagination(totalItems),
        { initialProps: { totalItems: 100 } }
      );
      act(() => {
        result.current.goToPage(4);
      });
      expect(result.current.currentPage).toBe(4);

      rerender({ totalItems: 50 });
      expect(result.current.currentPage).toBe(1);
    });
  });
});

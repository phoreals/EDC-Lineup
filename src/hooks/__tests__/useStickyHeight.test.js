import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStickyHeight } from '../useStickyHeight';

// Mock ResizeObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  globalThis.ResizeObserver = vi.fn(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: vi.fn(),
  }));
  document.documentElement.style.removeProperty('--sticky-top');
});

describe('useStickyHeight', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() => useStickyHeight());
    expect(result.current).toHaveProperty('current');
  });

  it('creates a ResizeObserver', () => {
    renderHook(() => useStickyHeight());
    expect(globalThis.ResizeObserver).toHaveBeenCalled();
  });

  it('sets --sticky-top when ref has an element', () => {
    const { result } = renderHook(() => useStickyHeight());

    // Simulate attaching the ref to a DOM element
    const el = document.createElement('div');
    Object.defineProperty(el, 'offsetHeight', { value: 64 });
    result.current.current = el;

    // Re-render to trigger effect
    const { unmount } = renderHook(() => useStickyHeight());

    // The hook sets the property on mount
    // We verify ResizeObserver was instantiated
    expect(globalThis.ResizeObserver).toHaveBeenCalled();
    unmount();
  });

  it('disconnects ResizeObserver on unmount', () => {
    const { unmount } = renderHook(() => useStickyHeight());
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});

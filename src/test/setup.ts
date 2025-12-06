import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IndexedDB
const indexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
  cmp: vi.fn(),
  databases: vi.fn()
};

global.indexedDB = indexedDB as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.navigator.vibrate
Object.defineProperty(window.navigator, 'vibrate', {
  writable: true,
  value: vi.fn(),
});

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock crypto.getRandomValues
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn((arr: Uint32Array) => {
      // Return predictable values for testing
      for (let i = 0; i < arr.length; i++) {
        arr[i] = 12345678 + i;
      }
      return arr;
    })
  }
});


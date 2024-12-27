import { afterEach, vitest } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import "@testing-library/jest-dom";

afterEach(() => {
  cleanup();
});

// Bypass for issue https://github.com/jsdom/jsdom/issues/2177
const originalConsoleError = console.error;
console.error = function (msg) {
  if (
    typeof msg === "string" &&
    msg.startsWith("Error: Could not parse CSS stylesheet")
  ) {
    return;
  }

  originalConsoleError(msg);
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vitest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vitest.fn(),
    removeListener: vitest.fn(),
    addEventListener: vitest.fn(),
    removeEventListener: vitest.fn(),
    dispatchEvent: vitest.fn(),
  })),
});

Object.defineProperty(global, "ResizeObserver", {
  writable: true,
  value: vitest.fn().mockImplementation(() => ({
    observe: vitest.fn(),
    unobserve: vitest.fn(),
    disconnect: vitest.fn(),
  })),
});

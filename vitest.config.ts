import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./src/setup-tests.ts"],
      include: ["./src/**/*.{test,spec}.{ts,tsx}"],
      globals: true,
    },
  })
);

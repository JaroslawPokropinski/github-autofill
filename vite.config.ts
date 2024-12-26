import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      include: ["src"],
      tsconfigPath: "tsconfig.app.json",
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      fileName: "main",
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "@chakra-ui/react"],
    },
  },
});

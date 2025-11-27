import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  watch: ["src/**"],
  external: [
    "next",
    "next/server",
    "next/dist/server/web/spec-extension/adapters/request-cookies",
  ],
});

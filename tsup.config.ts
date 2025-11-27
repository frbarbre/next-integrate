import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["./src/index.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  external: [
    "next",
    "next/server",
    "next/dist/server/web/spec-extension/adapters/request-cookies",
  ],
});

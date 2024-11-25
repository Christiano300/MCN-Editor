import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";

export default defineConfig({
  plugins: [wasmPack("../Rust/mcn-ls")],
  build: {
    target: "esnext",
    minify: "esbuild",
  },
  resolve: { dedupe: ["vscode"] },
});

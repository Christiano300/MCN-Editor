import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";

export default defineConfig({
  plugins: [wasmPack("../Rust/mcn-ls")],
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vscode: ["vscode"],
          languageclient: ["monaco-languageclient", "vscode-languageclient"],
        },
      },
    },
  },
  resolve: { dedupe: ["vscode"] },
  base: "/editor",
});

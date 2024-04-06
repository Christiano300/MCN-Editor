import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

export default defineConfig({
  plugins: [wasmPack("../Rust/mcn-ls"), monacoEditorPlugin({})],
  build: { target: "esnext" },
  resolve: { dedupe: ["vscode"] },
});

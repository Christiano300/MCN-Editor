import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

export default defineConfig({
  plugins: [wasmPack("../Rust/mcn-ls"), monacoEditorPlugin({ globalAPI: true })],
  build: { target: "esnext" },
  resolve: { dedupe: ["vscode"] },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [importMetaUrlPlugin]
  //   }
  // }
});

import init, { compile } from "mcn-ls";

import * as monaco from "monaco-editor";

import { initServices } from "monaco-languageclient/vscode/services";
import { MonacoLanguageClient } from "monaco-languageclient";

import {
  MessageTransports,
  MessageReader,
  MessageWriter,
} from "vscode-languageclient";

import {
  BrowserMessageReader,
  BrowserMessageWriter,
} from "vscode-jsonrpc/browser";
import { tokenProvider } from "./languageDef";
import { languageConfig } from "./languageDef";

const compileCode = (
  editor: monaco.editor.IStandaloneCodeEditor,
  out: HTMLElement
): any => {
  try {
    const asm = compile(editor.getValue());
    out.innerText = asm;
    out.classList.remove("error");
  } catch (error) {
    out.classList.add("error");
  }
};

const languageWorker = new Worker(
  new URL("./worker/languageWorker.ts", import.meta.url),
  { type: "module" }
);

const getConnections: (
  encoding: string
) => Promise<MessageTransports> = async () => {
  const reader: MessageReader = new BrowserMessageReader(languageWorker);
  const writer: MessageWriter = new BrowserMessageWriter(languageWorker);
  return Promise.resolve<MessageTransports>({
    reader,
    writer,
  });
};

const vividColors = {
  chalky: "e5c07b",
  coral: "ef596f",
  dark: "5c6370",
  error: "f44747",
  fountainBlue: "2bbac5",
  green: "89ca78",
  invalid: "ffffff",
  lightDark: "7f848e",
  lightWhite: "abb2bf",
  malibu: "61afef",
  purple: "d55fde",
  whiskey: "d19a66",
  deepRed: "BE5046",
};

init().then(async () => {
  const code = localStorage.getItem("monaco-editor-code") ?? "hi";

  await initServices({});

  monaco.languages.register({ id: "mcn-16" });

  monaco.languages.setLanguageConfiguration("mcn-16", languageConfig);
  monaco.languages.setMonarchTokensProvider("mcn-16", tokenProvider);

  monaco.editor.defineTheme("mcn-16-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      {
        token: "keyword",
        foreground: vividColors.purple,
      },
      {
        token: "number",
        foreground: vividColors.whiskey,
      },
      {
        token: "number.hex",
        foreground: vividColors.green,
      },
      {
        token: "number.binary",
        foreground: vividColors.green,
      },
      {
        token: "identifier",
        foreground: vividColors.coral,
      },
      {
        token: "operator",
        foreground: vividColors.fountainBlue,
      },
      {
        token: "punctuation.separator",
        foreground: vividColors.lightWhite,
      },
      {
        token: "comment",
        foreground: vividColors.dark,
      },
      {
        token: "invalid",
        foreground: vividColors.error,
      },
    ],
    colors: { "editor.background": "#282c34" },
  });

  const htmlElement = document.getElementById("monaco-editor-root")!;
  const editor = monaco.editor.create(htmlElement, {
    language: "mcn-16",
    theme: "mcn-16-dark",
    value: code,
  });

  window.onbeforeunload = () => {
    localStorage.setItem("monaco-editor-code", editor.getValue());
  };
  const out = document.getElementById("out")!;

  editor.onDidChangeModelContent(() => {
    compileCode(editor, out);
  });

  compileCode(editor, out);

  const languageClient = new MonacoLanguageClient({
    name: "MCN Language Client",
    clientOptions: {
      documentSelector: [{ language: "mcn-16" }],
      // synchronize: {
      //   configurationSection: "mcn",
      // },
    },
    connectionProvider: {
      get: getConnections,
    },
  });

  languageClient.start();

  document.querySelector("#loading")?.remove();
});

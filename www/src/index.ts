import init, { greet } from "my-crate";

init().then(() => {
  console.log("init wasm-pack");
  greet("Friedl");
});

import {
  MonacoEditorLanguageClientWrapper,
  UserConfig,
} from "monaco-editor-wrapper";
import * as monaco from "monaco-editor";

// no top-level await
const run = async () => {
  const wrapper = new MonacoEditorLanguageClientWrapper();
  const code = localStorage.getItem("monaco-editor-code") ?? "hi";
  const userConfig: UserConfig = {
    wrapperConfig: {
      editorAppConfig: {
        $type: "classic",
        useDiffEditor: false,
        languageId: "mcn-16",
        theme: "vs-dark",
        code: code,
        languageDef: {
          brackets: [{ open: "(", close: ")", token: "delimiter.parenthesis" }],
          ignoreCase: false,

          tokenPostfix: ".mcn-16",
          keywords: [
            "inline",
            "if",
            "elif",
            "elseif",
            "else",
            "forever",
            "while",
            "end",
            "pass",
            "use",
            "var",
            "debug",
          ],

          operators: [
            "+",
            "-",
            "*",
            "&",
            "|",
            "^",
            "+=",
            "-=",
            "*=",
            "&=",
            "|=",
            "^=",
            "=",
            "==",
            "!=",
            "<",
            ">",
            "<=",
            ">=",
          ],

          tokenizer: {
            root: [
              // identifiers and keywords
              [
                /[\p{L}](?:\d\p{L})*/,
                {
                  cases: {
                    "@keywords": "keyword",
                    "@default": "identifier",
                  },
                },
              ],
              { include: "@whitespace" },
              // delimiters and operators
              [/[()]/, "@brackets"],
              [/,./, "punctuation.separator"],
            ],
            whitespace: [
              [/[ \t\r\n;]+/, ""],
              [/#.*$/, "comment"],
            ],
            numbers: [
              [/0x[0-9a-f]+/, "number.hex"],
              [/0b[01]+/, "number.binary"],
              [/\d+/, "number"],
            ],
          },
        },
        languageExtensionConfig: {
          id: "mcn-16",
          extensions: [".🖥️"],
          aliases: ["mcn-16", "mcn"],
        },
      },
    },
  };

  const languageConfig: monaco.languages.LanguageConfiguration = {
    comments: {
      lineComment: "#",
    },

    brackets: [["(", ")"]],

    autoClosingPairs: [{ open: "(", close: ")" }],
    surroundingPairs: [
      { open: "(", close: ")" },
      { open: "forever", close: "end" },
      { open: "while", close: "end" },
      { open: "if", close: "end" },
      { open: "if", close: "else" },
      { open: "if", close: "elif" },
      { open: "if", close: "elseif" },
      { open: "elif", close: "end" },
      { open: "elseif", close: "end" },
      { open: "else", close: "end" },
    ],

    indentationRules: {
      increaseIndentPattern: new RegExp(
        "^\\s*(forever|else|(if|elif|elseif|while).*)\\s*$"
      ),
      decreaseIndentPattern: new RegExp("^\\s*(end)\\s*$"),
    },

    onEnterRules: [
      {
        beforeText: new RegExp("^\\s*(forever|else|(if|elif|elseif|while).*)$"),
        action: {
          indentAction: monaco.languages.IndentAction.IndentOutdent,
        },
      },
      {
        beforeText: new RegExp("^\\s*(end)$"),
        action: { indentAction: monaco.languages.IndentAction.Outdent },
      },
    ],
  };

  const htmlElement = document.getElementById("monaco-editor-root");
  await wrapper.initAndStart(userConfig, htmlElement);

  monaco.languages.setLanguageConfiguration("mcn-16", languageConfig);
  window.onbeforeunload = () => {
    localStorage.setItem(
      "monaco-editor-code",
      wrapper.getEditor()?.getValue()!
    );
  };
};

run();

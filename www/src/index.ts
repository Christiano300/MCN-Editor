import init, { compile } from "mcn-ls";

import * as monaco from "monaco-editor";

import { initServices } from "monaco-languageclient/vscode/services";
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

  await initServices({
    userServices: {},
    debugLogging: true,
  });

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
});

function compileCode(
  editor: monaco.editor.IStandaloneCodeEditor,
  out: HTMLElement
): any {
  try {
    const asm = compile(editor.getValue());
    out.innerText = asm;
    out.classList.remove("error");
  } catch (error) {
    out.classList.add("error");
  }
}

const tokenProvider: monaco.languages.IMonarchLanguage = {
  brackets: [{ open: "(", close: ")", token: "delimiter.parenthesis" }],
  defaultToken: "invalid",
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

  symbols: /[+\-*&|^]=?|!=|[=<>]=?/,

  tokenizer: {
    root: [
      { include: "@numbers" },
      { include: "@whitespace" },
      // delimiters and operators
      [/[()]/, "@brackets"],
      [/[,\.;]/, "punctuation.separator"],
      [/@symbols/, "operator"],
      // identifiers and keywords
      [
        /[\w][\d\w]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier",
          },
        },
      ],
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
};

const languageConfig: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: "#",
  },
  brackets: [["(", ")"]],
  autoClosingPairs: [
    {
      open: "(",
      close: ")",
    },
  ],
  surroundingPairs: [
    {
      open: "(",
      close: ")",
    },
    {
      open: "forever",
      close: "end",
    },
    {
      open: "while",
      close: "end",
    },
    {
      open: "if",
      close: "end",
    },
    {
      open: "if",
      close: "else",
    },
    {
      open: "if",
      close: "elif",
    },
    {
      open: "if",
      close: "elseif",
    },
    {
      open: "elif",
      close: "end",
    },
    {
      open: "elseif",
      close: "end",
    },
    {
      open: "else",
      close: "end",
    },
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
        indentAction: monaco.languages.IndentAction.Indent,
      },
    },
    {
      beforeText: new RegExp("^\\s*(end)$"),
      action: {
        indentAction: monaco.languages.IndentAction.Outdent,
      },
    },
  ],
};

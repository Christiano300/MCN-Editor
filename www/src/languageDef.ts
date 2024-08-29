import * as monaco from "monaco-editor";

export const tokenProvider: monaco.languages.IMonarchLanguage = {
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
      [/#.*/, "comment"],
    ],
    numbers: [
      [/0x[0-9a-f]+/, "number.hex"],
      [/0b[01]+/, "number.binary"],
      [/\d+/, "number"],
    ],
  },
};
export const languageConfig: monaco.languages.LanguageConfiguration = {
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

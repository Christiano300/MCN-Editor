import {
  BrowserMessageReader,
  BrowserMessageWriter,
  InitializeResult,
  ServerCapabilities,
  createConnection,
} from "vscode-languageserver/browser";

import init, { receive_message, LspServer } from "mcn-ls";

const log = (_) => {
  console.log(_);
  return _;
};

// self.onmessage = async ({ data }) => {
//   console.log(data);
// };

init().then(async () => {
  const reader = new BrowserMessageReader(self);
  const writer = new BrowserMessageWriter(self);

  const connection = createConnection(reader, writer);

  let lsp: LspServer;

  async function sendRequest(
    method: string,
    params: unknown
  ): Promise<unknown> {
    return await connection.sendRequest(method, params);
  }

  function sendNotification(method: string, params: unknown): boolean {
    connection.sendNotification(method, params);
    return true;
  }

  connection.onRequest(async (method, params, token) => {
    receive_message(
      JSON.stringify({ kind: "request", method, params, token }, null, 2)
    );
  });

  connection.onNotification(async (method, params) => {
    receive_message(
      JSON.stringify({ kind: "notification", method, params }, null, 2)
    );
  });

  connection.onInitialize(async (params) => {
    lsp = LspServer.new(sendNotification, sendRequest);
    console.log("init", params);
    receive_message(JSON.stringify({ kind: "init", params }, null, 2));
    return log(lsp.initialize(params));
  });

  connection.onDidOpenTextDocument(async (params) => {
    console.log("open", params);
    lsp.reload_document(params.textDocument.text, params.textDocument.version);
  });

  connection.onDidChangeTextDocument(async (params) => {
    console.log("change", params);
    receive_message("change")
    lsp.reload_document(
      params.contentChanges[0].text,
      params.textDocument.version
    );
  });

  receive_message("worker initialized");

  connection.listen();
});

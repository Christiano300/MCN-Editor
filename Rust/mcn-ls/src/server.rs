use js_sys::Function;
use wasm_bindgen::prelude::*;

use crate::language::initialize_result;

#[wasm_bindgen]
pub struct LspServer {
    document: String,
    last_document_version: i32,
    send_notification: Function,
    send_request: Function,
}

type JsResult<T = JsValue> = Result<T, JsError>;

pub trait Callable {
    fn call_0(&self) -> Result<JsValue, JsValue>;
    fn call_1(&self, arg1: &JsValue) -> Result<JsValue, JsValue>;
    fn call_2(&self, arg1: &JsValue, arg2: &JsValue) -> Result<JsValue, JsValue>;
    fn call_3(&self, arg1: &JsValue, arg2: &JsValue, arg3: &JsValue) -> Result<JsValue, JsValue>;
}

impl Callable for Function {
    fn call_0(&self) -> Result<JsValue, JsValue> {
        self.call0(&JsValue::UNDEFINED)
    }

    fn call_1(&self, arg1: &JsValue) -> Result<JsValue, JsValue> {
        self.call1(&JsValue::UNDEFINED, arg1)
    }

    fn call_2(&self, arg1: &JsValue, arg2: &JsValue) -> Result<JsValue, JsValue> {
        self.call2(&JsValue::UNDEFINED, arg1, arg2)
    }

    fn call_3(&self, arg1: &JsValue, arg2: &JsValue, arg3: &JsValue) -> Result<JsValue, JsValue> {
        self.call3(&JsValue::UNDEFINED, arg1, arg2, arg3)
    }
}

#[wasm_bindgen]
impl LspServer {
    pub fn new(send_notification: Function, send_request: Function) -> Self {
        Self {
            document: String::new(),
            last_document_version: -1,
            send_notification,
            send_request,
        }
    }

    pub fn initialize(&self, params: JsValue) -> JsResult<JsValue> {
        Ok(to_json_value(&initialize_result(
            &serde_wasm_bindgen::from_value(params)?,
        ))?)
    }

    pub fn reload_document(&mut self, text: String, version: i32) {
        if version <= self.last_document_version {
            return;
        }
        self.last_document_version = version;
        self.document = text;
    }
}

// Copied from: slint-ui/slint tools/lsp/wasm_main.rs
// Credit: https://github.com/slint-ui/slint
/// Use a JSON friendly representation to avoid using ES maps instead of JS objects.
fn to_json_value<T: serde::Serialize + ?Sized>(
    value: &T,
) -> Result<JsValue, serde_wasm_bindgen::Error> {
    value.serialize(&serde_wasm_bindgen::Serializer::json_compatible())
}

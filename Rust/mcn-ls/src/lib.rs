extern crate cfg_if;
extern crate redstone_compiler;
extern crate wasm_bindgen;

mod language;
mod server;
mod utils;

use cfg_if::cfg_if;
use wasm_bindgen::prelude::*;


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn setup() {
    utils::set_panic_hook();
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    log(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn receive_message(message: &str) {
    log(&format!("Received message: {}", message));
}

#[wasm_bindgen]
pub fn compile(code: &str) -> Result<String, String> {
    let tokens = redstone_compiler::frontend::tokenize(code).map_err(|_| "Tokenization error")?;
    let mut parser = redstone_compiler::frontend::Parser::new();
    let ast = parser.produce_ast(tokens).map_err(|_| "Parsing error")?;
    let code = redstone_compiler::backend::compile_program(ast).map_err(|_| "Compilation error")?;
    let mut asm_string = String::new();
    code.iter()
        .map(|instr| format!("{instr}\n"))
        .for_each(|line| asm_string.push_str(&line));
    Ok(asm_string)
}

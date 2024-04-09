extern crate cfg_if;
extern crate redstone_compiler;
extern crate wasm_bindgen;

mod utils;

use cfg_if::cfg_if;
use wasm_bindgen::prelude::*;

cfg_if! {
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn setup() {
    utils::set_panic_hook();
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
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

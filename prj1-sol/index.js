const lexer = require("./lexer/Lexer");
const Parser = require("./parser/Parser")
const ASTParser = require("./parser/ASTParser")
const fs = require("fs")

const outType = process.env.OUT_TYPE;

// read input
function show_options(expr) {
    const tokens = lexer.scan(expr);
    if (tokens.length === 0) return '';
    switch (outType) {
      case 'ast':
        return JSON.stringify(new ASTParser(expr).parse());
      case 'tokens':
        return tokens;
      default:
        return JSON.stringify(new Parser(expr).parse());
    }
}

const expr = fs.readFileSync(0, 'utf8') // will read from standard input until EOF
console.log(show_options(expr));
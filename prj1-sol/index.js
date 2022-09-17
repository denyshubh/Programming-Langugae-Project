const lexer = require("./lexer/Lexer");
const Parser = require("./parser/Parser")
const ASTParser = require("./parser/AST_Parser")
const fs = require("fs")
// read input
function show_options(expr, outType) {
    const tokens = lexer.scan(expr);
    if (tokens.length === 0) return '';
    switch (outType) {
      case 'ast':
        return JSON.stringify(new ASTParser(expr).parse());
      case 'tokens':
        return tokens;
      default:
        return new Parser(expr).parse();
    }
}

const expr = fs.readFileSync(0, 'utf8') // will read from standard input until EOF
console.log(show_options(expr, null));
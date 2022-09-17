const Lexer = require("lexer/Lexer");
const CALCParser = require("parser/CALC_Parser")
const ASTParser = require("parser/AST_parser")

// read input
function show_options(expr, outType) {
    const tokens = Lexer.scan(expr);
    if (tokens.length === 0) return '';
    switch (outType) {
      case 'ast':
        return JSON.stringify(new ASTParser(expr).parse());
      case 'tokens':
        return tokens;
      default:
        return new CALCParser(expr).parse();
    }
}

const expr = fs.readFileSync(0, 'utf8') // will read from standard input until EOF.
console.log(show_options(expr, null));
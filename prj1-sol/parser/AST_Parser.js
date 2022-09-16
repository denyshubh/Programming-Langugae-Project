const Token = require("../lexer/Token");
const Lexer = require("../lexer/Lexer");
const AST = require("../ast/Ast");

/**
 * Parser implementation for a language.
 * Converts stream of tokens into AST.
 *
 * @class
 * @since 1.0.0
 */
class ASTParser {
  /**
   * Creates new parser instance.
   * It accepts as an input source code of a program.
   * In result, it will parse it and return an AST of specified program.
   * As a dependency, it uses the lexer which returns stream of tokens.
   *
   * @param {String} input Source code of a program
   * @example
   * const parser = new Parser('{22,[6...8] = 33,54, [12 ... 14] = { 44, 33, [4] = { 99, }, },}');
   */
  constructor(input) {
    this.lexer = new Lexer(input);
    this.currentToken = this.lexer.getNextToken();
  }

  /**
   * Consumes one specified token type.
   * In case, token type is not equal to the current one, it throws an error.
   * When you are consuming a token you are not expecting, it means broken syntax structure.
   *
   * @param {String} tokenType Token type from {@link Token} dictionary
   * @returns {Parser} Returns current parser instance
   * @example
   * const parser = new Parser('{22,[6...8] = 33,54, [12 ... 14] = { 44, 33, [4] = { 99, }, },}'); // currentToken = LCURLY
   *
   * parser
   *  .eat(Token.LCURLY) // currentToken = LCURLY
   *  .eat(Token.NUMBER) // currentToken = NUMBER
   *  .eat(Token.NUMBER) // throws an error, because currentToken = COMMA
   */
  eat(tokenType) {
    if (this.currentToken.is(tokenType)) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      Parser.error(
        `You provided unexpected token type "${tokenType}" while current token is ${this.currentToken}`
      );
    }

    return this;
  }

  /**
   * empty:
   *
   * @returns {NoOperation}
   */
  empty() {
    return new AST("empty");
  }

  /**
   * val: INT
   *     | '{' initializers '}'
   *
   * @returns {Node}
   */
  val() {
    const token = this.currentToken;
    if (token.is(Token.NUMBER)) { this.eat(Token.NUMBER); return token.value; }
    
    if (token.is(Token.LCURLY)) {
      this.eat(Token.LCURLY);
      const node = this.initializers();
      this.eat(Token.RCURLY);
      return new AST(Token.LCURLY, node, Token.RCURLY);
    }
  }

  /**
   * initializers : initializer (',' initializer )* , ?
   * | empty
   *
   * @returns {Node}
   */
  initializers() {
    let node1 = this.initializer();
    const nodes = [];
    while ([Token.COMMA].some((type) => this.currentToken.is(type))) {
      const token = this.currentToken;
      if (token.is(Token.COMMA)) {
        this.eat(Token.COMMA);
        const node2 = this.initializer();
        nodes.push(new AST(Token.COMMA, node1, node2));
      } else {
        nodes.push(this.empty());
      }
    }
    if ([Token.ENDCOMMA].some((type) => this.currentToken.is(type))) {
        this.eat(Token.ENDCOMMA);
        nodes.push(new AST(Token.ENDCOMMA, node1));
    }

    return nodes;

  }

  /**
   * initializer : '[' INT temp
   *  						 | val
   *
   * @returns {Node}
   */

  initializer() {
    const token = this.currentToken;
    if (token.is(Token.LSQUARE)) {

      this.eat(Token.LSQUARE);
      const n = this.currentToken.value; // storing the number before eating it.
      this.eat(Token.NUMBER);
      const node = this.temp();
      return new AST(Token.LSQUARE, n, node);

    } else { const node = this.val(); return new AST(node);
    }
  }

  /**
   * temp : ']' '=' val
   * 			| '...' INT ']' '=' val
   */

  temp() {
    const token = this.currentToken;
    let node = null;
    if (token.is(Token.RSQUARE)) {
      this.eat(Token.RSQUARE);
      this.eat(Token.EQUAL);
      node = this.val();
      return new AST(Token.RSQUARE, Token.EQUAL, node);
    } else if (token.is(Token.RANGE)) {
      this.eat(Token.RANGE);
      const n = this.currentToken.value; // storing number before eating it
      this.eat(Token.NUMBER);
      this.eat(Token.RSQUARE);
      this.eat(Token.EQUAL);
      node = this.val();
      return new AST(
        Token.RANGE,
        n,
        Token.RSQUARE,
        Token.EQUAL,
        node
      );
    }
  }

  /**
   * Parses an input source program and returns an AST.
   * It uses all the grammar rules above to parse tokens and build AST from it.
   *
   * @returns {Node}
   * @example
   * const parser = new Parser('BEGIN END.');
   *
   * parser.parse(); // return an object that represents an AST of source program
   */
  parse() {
    return this.val();
  }

  /**
   * Static helper for notifying about an error, during parsing.
   *
   * @static
   * @param {String} msg Error message
   */
  static error(msg) {
    throw new Error(`[Parser]\n${msg}`);
  }
}

// Test the code
const parser = new ASTParser(
  "{22,[6...8] = 33,54, [12 ... 14] = { 44, 33, [4] = { 99, }, },}"
);
const tree = parser.parse();
console.log(JSON.stringify(tree));

module.exports = ASTParser;

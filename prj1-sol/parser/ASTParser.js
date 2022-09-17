const Token = require("../lexer/Token");
const _lex = require("../lexer/Lexer");

/**
 * Parser implementation for a language.
 * Converts stream of tokens into AST.
 *
 * @class
 * @since 1.0.0
 */
class ASTParser {
  /** 
   * * Creates new parser instance.
   * It accepts as an input source code of a program.
   * In result, it will parse it and return an AST of specified program.
   * As a dependency, it uses the lexer which returns stream of tokens.
   *
   * @param {String} input Source code of a program
   * @example
   * const parser = new Parser('{22,[6...8] = 33,54, [12 ... 14] = { 44, 33, [4] = { 99, }, },}');
   */
  constructor(input) {
    this.lexer = new _lex.Lexer(input);
    this.currentToken = this.lexer.getNextToken();
    this.res = [];
    this.pos = [];
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
      ASTParser.error(
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
    return null;
  }

  /**
   * 
   */
  handleRange(array, value, start, stop) {
    // case when initializer only return a value and no start and stop
    if (!start) { array.push(value); }
    else { 
      for (let i=start; i<=stop; i++) { array[i] = value; } 
      for (let i = 0; i<array.length; i++) {
        if (!array[i]) array[i] = 0;
      }
    }

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
      const  array = [];
      this.initializers(array);
      this.eat(Token.RCURLY);
      return array;
    }
  }


  /**
   * initializers : initializer (',' initializer )* , ?
   * | empty
   *
   * @returns {Node}
   */
  initializers(array) {
    const [value, start, stop] = this.initializer();
    this.handleRange(array, value, start, stop);
    if (value) {
      while ([Token.COMMA].some((type) => this.currentToken.is(type))) {
        const token = this.currentToken;
        if (token.is(Token.COMMA)) {
          this.eat(Token.COMMA);
          const [value, start, stop] = this.initializer();
          this.handleRange(array, value, start, stop)
        }
      }
      if(this.currentToken.is(Token.ENDCOMMA)) {
        this.eat(Token.ENDCOMMA);
      }
    } else {  this.empty();  }
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
      const start = this.currentToken.value; // storing the number before eating it.
      this.eat(Token.NUMBER);
      const [value, stop] = this.temp();
      return !stop ? [value, start, start+1] : [value, start, stop];
    }
    return [this.val(), undefined, undefined];
  }

  /**
   * temp : ']' '=' val
   * 			| '...' INT ']' '=' val
   */

  temp() {
    const token = this.currentToken;
    if (token.is(Token.RSQUARE)) {
      this.eat(Token.RSQUARE);
      this.eat(Token.EQUAL);
      const v = this.val();
      return [v, undefined];
    } else if (token.is(Token.RANGE)) {
      this.eat(Token.RANGE);
      const stop = this.currentToken.value; // storing number before eating it
      this.eat(Token.NUMBER);
      this.eat(Token.RSQUARE);
      this.eat(Token.EQUAL);
      const v = this.val();
      return [v, stop];
    }
  }


  // removeNull(array) {
  //   if (!array) return;
  //   for(let i =0; i<array.length; i++) {
  //       if (typeof(array[i]) == "object") this.removeNull(array[i]);
  //       if (!array[i]) array[i] = 0;
  //   }
  // }

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
    const array = this.val();
    if (array[0] == undefined) { return []; }
    return array;
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

module.exports = ASTParser;
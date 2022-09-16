const Token = require("../lexer/Token");
const Lexer = require("../lexer/Lexer");

/**
 * Parser implementation for a language.
 * Converts stream of tokens into AST.
 *
 * @class
 * @since 1.0.0
 */
class CALCParser {
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
      CALCParser.error(
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
    return [];
  }

  /**
   * val: INT
   *     | '{' initializers '}'
   *
   * @returns {Node}
   */
  val(array) {
    const token = this.currentToken;
    if (token.is(Token.NUMBER)) { this.eat(Token.NUMBER); return token.value; }
    if (token.is(Token.LCURLY)) {
      this.eat(Token.LCURLY);
      array.push([]);
      this.initializers(array[array.length-1]);
      return array
    } 
    if (token.is(Token.RCURLY)) {  this.eat(Token.RCURLY); return array }

    CALCParser.error(`Invalid Token at the given position ${token}`);
    
  }

  /**
   * initializers : initializer (',' initializer )* , ?
   * | empty
   *
   * @returns {Node}
   */
  initializers(array) {
    this.initializer(array);

    while ([Token.COMMA].some((type) => this.currentToken.is(type))) {
      const token = this.currentToken;
      if (token.is(Token.COMMA)) {
        this.eat(Token.COMMA);
        this.initializer(array);
      }
    }
  }

  /**
   * initializer : '[' INT temp
   *  						 | val
   *
   * @returns {Node}
   */

  initializer(array) {
    const token = this.currentToken;
    if (token.is(Token.LSQUARE)) {
      this.eat(Token.LSQUARE);
      const n = this.currentToken.value; // storing the number before eating it.
      if (typeof n === 'number') { 
        const min = Math.min(array.length, n);
        const max = Math.max(array.length, n);
        for (let i=min; i<max; i++) { array.push(0); }
      }
      this.eat(Token.NUMBER);
      this.temp(array);
      
    } else { 
        const val = this.val(array); 
        /**
         * Some Recursives calls are returing array instead of NUMBER, 
         * Using conditional statement to remoove that bug.
         */
        if (typeof val === 'number') {
          array.push(val); 
        }
      }
  }

  /**
   * temp : ']' '=' val
   * 			| '...' INT ']' '=' val
   */

  temp(array) {
    const token = this.currentToken;
    if (token.is(Token.RSQUARE)) {
      this.eat(Token.RSQUARE);
      this.eat(Token.EQUAL);
      const val = this.val(array);
      /**
       * Some Recursives calls are returing array instead of NUMBER, 
       * Using conditional statement to remoove that bug.
       */
      if (typeof val === 'number') { array.push(val) ; }
    } else if (token.is(Token.RANGE)) {
      this.eat(Token.RANGE);
      const n = this.currentToken.value; // storing number before eating it
      this.eat(Token.NUMBER);
      this.eat(Token.RSQUARE);
      this.eat(Token.EQUAL);
      const val = this.val(array);
      /**
       * Some Recursives calls are returing array instead of NUMBER, 
       * Using conditional statement to remoove that bug.
       */
      if (typeof val === 'number') {
        const min = Math.min(array.length, n);
        const max = Math.max(array.length, n);
        for(let i=min; i<=max; i++) { array.push(val) };
      }
    } else { CALCParser.error(`Invalid syntax, expecting ] or ... and got ${token.value}`); }
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
    return this.val([]);
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

module.exports = CALCParser;

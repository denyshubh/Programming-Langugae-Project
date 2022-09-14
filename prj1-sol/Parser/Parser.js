const Token = require('../lexer/Token');
const Lexer = require('../lexer');
const AST = require('../ast');

/**
 * Parser implementation for a language.
 * Converts stream of tokens into AST.
 *
 * @class
 * @since 1.0.0
 */
class Parser {
  /**
   * Creates new parser instance.
   * It accepts as an input source code of a program.
   * In result, it will parse it and return an AST of specified program.
   * As a dependency, it uses the lexer which returns stream of tokens.
   *
   * @param {String} input Source code of a program
   * @example
   * const parser = new Parser('2 + 5');
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
   * const parser = new Parser('2 + 5'); // currentToken = INTEGER
   *
   * parser
   *  .eat(Token.INTEGER) // currentToken = PLUS
   *  .eat(Token.PLUS) // currentToken = INTEGER
   *  .eat(Token.PLUS) // throws an error, because currentToken = INTEGER
   */
  eat(tokenType) {
    if (this.currentToken.is(tokenType)) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      Parser.error(`You provided unexpected token type "${tokenType}" while current token is ${this.currentToken}`);
    }

    return this;
  }

  /**
   * empty:
   *
   * @returns {NoOperation}
   */
  empty() {
    return AST.NoOperation.create();
  }

  /**
   *  initializer: '[' INT ']' '=' val
   *       | '[' INT RANGE INT ']' '=' val
   *       | val
   *
   * @returns {Node}
   */

  initializer() {
    const token = this.currentToken;

    if (token.is(Token.LSQUARE)) {
      this.eat(Token.LSQUARE);
      this.eat(Token.NUMBER);
      this.eat(Token.RSQUARE);
      this.eat(Token.EQUAL);
      return this.val();
      
    } else if (token.is(Token.LSQUARE)) {
      this.eat(Token.LSQUARE);
      this.eat(Token.NUMBER);
      this.eat(Token.RANGE);
      this.eat(Token.NUMBER);
      this.eat(Token.RSQUARE);
      this.eat(Token.EQUAL);
      return this.val();
    } 

    return this.val();
  }

  /**
   * initializers: initializer (',' initializer)*','?
   *     | empty
   *
   * @returns {Node}
   */
  initializers() {
    let node = this.initializer;

    while ([Token.COMMA, Token.ENDCOMMA].some(type => this.currentToken.is(type))) {
      const token = this.currentToken;

      if (token.is(Token.COMMA)) {
        this.eat(Token.COMMA);
        node = this.initializer();
        return node
      } else if (token.is(Token.ENDCOMMA)) {
        this.eat(Token.ENDCOMMA);
      } else {
        node = this.empty();
      }

      node = AST.BinaryOperator.create(node, token, this.initializer());
    }

    return node;
  }

  /**
   * expr: INT
   *     | '{' initializers'}'
   *
   * @returns {Node}
   */
  expr() {
    let node = this.initializers;

    while ([Token.NUMBER].some(type => this.currentToken.is(type))) {
      const token = this.currentToken;

      if (token.is(Token.NUMBER)) {
        this.eat(Token.NUMBER);
      } else if (token.is(Token.LCURLY)){
        this.eat(Token.LCURLY);
        node = this.initializers()
        this.eat(Token.RCURLY)
      }

      // node = AST.BinaryOperator.create(node, token, this.term());
    }

    return node;
  }

  /**
   * program: PROGRAM variable SEMICOLON block DOT
   *
   * @returns {Node}
   */
  program() {
    this.eat(Token.PROGRAM);

    const variableNode = this.variable();
    const programName = variableNode.getName();

    this.eat(Token.SEMICOLON);

    const blockNode = this.block();
    const programNode = AST.Program.create(programName, blockNode);
    this.eat(Token.DOT);

    return programNode;
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
    return this.program();
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

module.exports = Parser;
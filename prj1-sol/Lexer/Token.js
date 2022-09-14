/**
 * Represents a token in a source code of a program.
 *
 * @class
 * @since 1.0.0
 */
class Token {
    /**
     * Creates a new Token instance.
     *
     * @param {String} type Token type from {@link Token} static dictionary
     * @param {String} value Value of a token
     * @example
     * new Token(Token.INTEGER, '1234');
     * new Token(Token.RSQUARE, ']');
     * new Token(Token.INTEGER, '5678');
     */
    constructor(type, value) {
      this.type = type;
      this.value = value;
    }
  
    /**
     * Returns a type of a token.
     *
     * @returns {String}
     */
    getType() {
      return this.type || null;
    }
  
    /**
     * Returns a value of a token.
     *
     * @returns {String}
     */
    getValue() {
      return this.value || null;
    }
  
    /**
     * Check if specified token type is this token.
     *
     * @param {String} tokenType Token type from {@link Token} static dictionary
     * @returns {Boolean} Returns true if provided type is equal to type of this token
     * @example
     * const token = Token.create(Token.INTEGER, '234');
     *
     * token.is(Token.INTEGER); // true
     * token.is(Token.RCURLY); // false
     */
    is(tokenType) {
      return this.getType() === tokenType;
    }
  
    /**
     * Converts a token into string representation.
     * It useful when you need to debug some tokens.
     * Instead of printing a token as object, it will print as a string.
     * Format of this string is following: Token(<type>, <value>).
     *
     * @returns {String} Returns a string in format Token(<type>, <value>)
     * @example
     * const token = Token.create(Token.INTEGER, '1234');
     *
     * console.log(token); // Token(INTEGER, 1234)
     */
    toString() {
      return `Token(${this.getType()}, ${this.getValue()})`;
    }
  
    /**
     * Creates a new Token instance.
     *
     * @static
     * @param {String} type Token type from {@link Token} static dictionary
     * @param {String} value Value of a token
     * @returns {Token} Returns instantiated instance of a Token
     * @example
     * Token.create(Token.INTEGER, 1234);
     * Token.create(Token.EQUAL, '=');
     * Token.create(Token.INTEGER, 5678);
     */
    static create(type, value) {
      return new this(type, value);
    }

    /**
     * Returns a Token type for a number Value ([0-9]*\.?[0-9]+).
     *
     * @static
     * @returns {String}
     */
    static get NUMBER() {
      return 'NUMBER';
    }

    /**
     * Returns a Token type for a comma symbol (,).
     *
     * @static
     * @returns {String}
     */
    static get COMMA() {
      return 'COMMA';
    }

    /**
     * Returns a Token type for a comma symbol (,).
     *
     * @static
     * @returns {String}
     */
         static get ENDCOMMA() {
          return 'ENDCOMMA';
        }
  
    /**
     * Returns a Token type for a equal symbol (=).
     *
     * @static
     * @returns {String}
     */
    static get EQUAL() {
      return 'EQUAL';
    }
  
    /**
     * Returns a Token type for an range symbol (...).
     *
     * @static
     * @returns {String}
     */
    static get RANGE() {
      return 'RANGE';
    }
  
    /**
     * Returns a Token type for a right curly brackets sign ({).
     *
     * @static
     * @returns {String}
     */
    static get RCURLY() {
      return 'RCURLY';
    }
  
    /**
     * Returns a Token type for a left curly brackets sign (}).
     *
     * @static
     * @returns {String}
     */
    static get LCURLY() {
      return 'LCURLY';
    }
  
    /**
     * Returns a Token type for a right square brackets sign (]).
     *
     * @static
     * @returns {String}
     */
    static get RSQUARE() {
      return 'RSQUARE';
    }
    
    /**
     * Returns a Token type for a left square brackets sign ([).
     *
     * @static
     * @returns {String}
     */
    static get LSQUARE() {
      return 'LSQUARE';
    }
  
    /**
     * Returns a Token type for end-of-file.
     *
     * @static
     * @returns {String}
     */
    static get EOF() {
      return 'EOF';
    }

    /**
     * Returns a Token type for garbage tokens in a program.
     * Valid identifier starts with an alphabetical character.
     *
     * @static
     * @returns {String}
     */
    static get GARBAGE() {
      return 'GARBAGE';
    }

  }
  
module.exports = Token;
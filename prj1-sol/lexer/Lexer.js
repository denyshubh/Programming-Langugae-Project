const Token = require('./Token');
/**
 * Lexer of a language.
 *
 * @class
 * @since 1.0.0
 */
class Lexer {
  /**
   * Creates a new instance of a lexer.
   * When instance created, you need to call {@link Lexer#getNextToken} for get a token.
   * Each time you call {@link Lexer#getNextToken} it returns next token from specified input.
   *
   * @param {String} input Source code of a program
   * @example
   * const lexer = new Lexer('2 + 5');
   */
  constructor(input) {
    this.input = input.replace(/\s+/g, ''); // remove all the whitespace from the input string
    this.position = 0;
    this.currentChar = this.input[this.position];
  }

  /**
   * Lexer has a pointer that specifies where we are located right now in input.
   * This method moves this pointer by one, incrementing its value.
   * Afterwards, it reads a new char at new pointer's location and stores in `currentChar`.
   * In case, pointer is out-of-range (end of input) it assigns `null` to `currentChar`.
   *
   * @returns {Lexer} Returns current instance of the lexer
   * @example
   * const lexer = new Lexer('[5 , 8]'); // position = 0, currentChar = '['
   *
   * lexer
   *  .advance() // position = 1, currentChar = ' '
   *  .advance() // position = 2, currentChar = ','
   *  .advance() // position = 3, currentChar = ' '
   *  .advance() // position = 4, currentChar = '8'
   *  .advance() // position = 5, currentChar = null
   *  .advance() // position = 6, currentChar = null
   */
  advance() {
    this.position++;
    this.currentChar = this.position > this.input.length - 1 ? null : this.input[this.position];
    return this;
  }

  /**
   * Peeks a following character from the input without modifying the pointer.
   * The difference here between {@link Lexer#advance} is that this method is pure.
   * It helps differentiate between different tokens that start with the same character.
   * I.e. ':' and ':=' are different tokens, but we can't say that for sure until we see the next char.
   * Also, Our Grammer we have commas at two places at it can be can be problematic for parsing using 
   * only a single token lookahead. This because when a ',' is seen while in this rule, it is not clear 
   * whether it starts the ( ',' ... )* or is the optional trailing comma ','? at the end of initializers. 
   * 
   * Solution to this would be to look ahead at the next token after the ','. 
   * If it can start an initializer, then the parser should commit to the ( ',' ... )*;
   * otherwise it should regard the ',' as constituting the optional comma.
   * 
   * @returns {String}
   * @example
   * const lexer = new Lexer('2 + 5'); // pointer = 0, currentChar = '2'
   *
   * lexer
   *  .peek() // pointer = 0, currentChar = '2', returns ' '
   *  .advance() // pointer = 1, currentChar = ' '
   *  .peek() // pointer = 1, currentChar = ' ', returns '+'
   */
  peek() {
    const position = this.position + 1;

    if (position > this.input.length - 1) return null;

    return this.input[position];
  }

  /**
   * Skips whitespaces in a source code.
   * While `currentChar` is a whitespace do {@link Lexer#advance}.
   * That way, we literally skips any char that doesn't make sense to us.
   *
   * @returns {Lexer} Returns current instance of the lexer
   */
  skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar)) {
      this.advance();
    }

    return this;
  }

  /**
   * Parses a Range Symbol from the source code
   * While current char is a dot (.) we need to get other two dots
   * into the token
   */
  range(){
      let count = 1;
      while(this.currentChar && /\./.test(this.currentChar)) {
        this.advance();
        count++;
      }
      if (count == 4) {
        return Token.create(Token.RANGE, '...');
      } 

      return Lexer.error("Please provide a valid range symbol (...) ")
      
      
  }


  /**
   * Parses an number from a source code.
   * While `currentChar` is a digit [0-9], add a char into the string stack.
   * Afterwards, when `currentChar` is not a digit anymore, parses an number from the stack.
   *
   * @returns {Number}
   */
  number() {
    let number = '';

    while (this.currentChar && /\d/.test(this.currentChar)) {
      number += this.currentChar;
      this.advance();
    }

    // if (this.currentChar === '.') {
    //   number += this.currentChar;
    //   this.advance();

    //   while (this.currentChar && /\d/.test(this.currentChar)) {
    //     number += this.currentChar;
    //     this.advance();
    //   }

    //   return Token.create(Token.NUMBER, parseFloat(number)); // We can change our token to find out the floating number
    // }

    return Token.create(Token.NUMBER, parseInt(number));
  }


  /**
   * Returns a next token in a source program.
   * Each time it sees a match from the source program, it wraps info into a {@link Token}.
   * It means, that it doesn't return all the tokens at once.
   * You need to call this method each time, you need to get next token from the input program.
   *
   * @returns {Token}
   * @example
   * const lexer = new Lexer('2 + 5');
   *
   * lexer.getNextToken(); // Token(INTEGER, 2)
   * lexer.getNextToken(); // Token(PLUS, +)
   * lexer.getNextToken(); // Token(INTEGER, 5)
   * lexer.getNextToken(); // Token(EOF, null)
   * lexer.getNextToken(); // Token(EOF, null)
   */
  getNextToken() {
    while (this.currentChar) {

      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      if (/\d/.test(this.currentChar)) {
        return this.number();
      }

      if (this.currentChar === '=') {
        this.advance();
        return Token.create(Token.EQUAL, '=');
      }

      if (this.currentChar === ',' && this.peek() === '}') {
        this.advance();
        return Token.create(Token.ENDCOMMA, ',');
      }

      if (this.currentChar === ',') {
        this.advance();
        return Token.create(Token.COMMA, ',');
      }

      if (this.currentChar === '[') {
        this.advance();
        return Token.create(Token.LSQUARE, '[');
      }

      if (this.currentChar === ']') {
        this.advance();
        return Token.create(Token.RSQUARE, ']');
      }

      if (this.currentChar === '{') {
        this.advance();
        return Token.create(Token.LCURLY, '{');
      }

      if (this.currentChar === '}') {
        this.advance();
        return Token.create(Token.RCURLY, '}');
      }

      if (this.currentChar === '.') {
        return this.range()
      }

      Lexer.error(`Unexpected character: ${this.currentChar}`);
    }

    return Token.create(Token.EOF, null);
  }

  /**
   * Throws an error in a lexer context.
   *
   * @static
   * @param {String} msg An error message
   */
  static error(msg) {
    throw new Error(`[Lexer]\n${msg}`);
  }
}

function scan(input){
  const test = new Lexer(input);
  const tok = [];
  let t = test.getNextToken();
  while ( t.type != 'EOF') {
    tok.push({'kind': t.type, 'lexeme': t.value})
    t = test.getNextToken()
  }
  return tok
}
// test this module
// console.log(scan('{22,[6...8] = 33,54, [12 ... 14] = { 44, 33, [4] = { 99, }, },}'))

module.exports = Lexer;
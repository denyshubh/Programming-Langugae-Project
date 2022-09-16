//returns Error object or JSON string
function arith(expr, outType) {
    const tokens = scan(expr);
    if (tokens.length === 0) return '';
    let result;
    switch (outType) {
      case 'ast':
        result = new AstParser(tokens).parse();
        break;
      case 'tokens':
        result = tokens;
        break;
    }
    return result;
  }
  
  //common functionality for parsers
  class Parser {
    constructor(tokens) {
      this._tokens = tokens;
      this._index = 0;
      this.lookahead = this._nextToken();
    }
  
    //wrapper used for crude  error recovery
    parse() {
      try {
        let result = this.parseLo();
        if (!this.check('EOF')) {
      const msg = `expecting end-of-input at "${this.lookahead.lexeme}"`;
      throw new SyntaxError(msg);
        }
        return result;
      }
      catch (err) {
        return err;
      }
    }
  
    check(kind) {
      return this.lookahead.kind === kind;
    }
    
    match(kind) {
      if (this.check(kind)) {
        this.lookahead = this._nextToken();
      }
      else {
        const msg = `expecting ${kind} at "${this.lookahead.lexeme}"`;
        throw new SyntaxError(msg);
      }
    }
  
    _nextToken() {
      if (this._index < this._tokens.length) {
        return this._tokens[this._index++];
      }
      else {
        return new Token('EOF', '<EOF>');
      }
    }
    
  } //Parser
  
  //we need to use Math.trunc() to simulate integer arith
  //since JS only supports floats.
  class CalcParser extends Parser {
    constructor(expr) {
      super(expr);
    }
  
    parseLo() { return this.expr(); }
  
    // expr
    //   : term ( ( '+' | '-' ) term ) *
    //   ;
    expr() {
      let t = this.term();
      while (this.check('+') || this.check('-')) {
        const tok  = this.lookahead;
        const op = tok.lexeme;
        this.match(tok.kind);
        const t1 = this.term();
        if (op === '+') t += t1; else t -= t1;
        t = Math.trunc(t);
      }
      return t;
    }
  
    // term
    //   : factor ( ( '*' | '/' ) factor ) *
    //   ;
    term() {
      let f = this.factor();
      while (this.check('*') || this.check('/')) {
        const tok  = this.lookahead;
        const op = tok.lexeme;
        this.match(tok.kind);
        const f1 = this.factor();
        if (op === '*') f *= f1; else f /= f1;
        f = Math.trunc(f);
      }
      return f;
    }
  
    // factor
    //   : '-' factor
    //   | INT
    //   | '(' expr ')'
    //   ;
    factor() {
      if (this.check('-')) {
        this.match('-');
        const f = this.factor();
        return -f;
      }
      else if (this.lookahead.kind == 'INT') {
        const tok = this.lookahead;
        this.match('INT');
        return Number.parseInt(tok.lexeme);
      }
      else {
        this.match('(');
        const e = this.expr();
        this.match(')');
        return e;
      }
    }
  
  } //CalcParser
  
  class AstParser extends Parser {
    constructor(expr) {
      super(expr);
    }
  
    parseLo() { return this.expr(); }
  
    // expr
    //   : term ( ( '+' | '-' ) term ) *
    //   ;
    expr() {
      let t = this.term();
      while (this.check('+') || this.check('-')) {
        const op = this.lookahead.kind;
        this.match(op);
        const t1 = this.term();
        t = new Ast(op, t, t1);
      }
      return t;
    }
  
    // term
    //   : factor ( ( '*' | '/' ) factor ) *
    //   ;
    term() {
      let f = this.factor();
      while (this.check('*') || this.check('/')) {
        const op = this.lookahead.kind;
        this.match(op);
        const f1 = this.factor();
        f = new Ast(op, f, f1);
      }
      return f;
    }
  
    // factor
    //   : '-' factor
    //   | INT
    //   | '(' expr ')'
    //   ;
    factor() {
      if (this.check('-')) {
        this.match('-');
        const f = this.factor();
        return new Ast('uminus', f);
      }
      else if (this.lookahead.kind == 'INT') {
        const tok = this.lookahead;
        this.match('INT');
        const ast = new Ast('INT');
        ast.value = Number.parseInt(tok.lexeme);
        return ast;
      }
      else {
        this.match('(');
        const e = this.expr();
        this.match(')');
        return e;
      }
    }
  
  } //AstParser
  
  class Ast {
    constructor(tag, ...kids) {
      this.tag = tag;
      this.kids = kids;
    }
  }
  


export default arith;
  
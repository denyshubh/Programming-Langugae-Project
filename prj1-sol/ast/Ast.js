/**
 * 
 */

class Ast {
    constructor(tag, ...kids) {
      this.tag = tag;
      this.kids = kids;
    }
}

module.exports = Ast;
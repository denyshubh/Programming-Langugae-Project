Name:		SHUBHAM KUMAR SINGH
B-Number:	B00955182
Email:		ssing163@binghamton.edu

# Projects Files Description

- parser/ : <em>This folder contains two files, <strong>Parser.js and ASTParser.js. Parser.js </strong> uses the cfg grammer to generate and validate the input expresssion. Whereas, ASTParser.js generates syntax tree and returns json for the same. </em>

- lexer/ : <em>This folder contains code for generating lexemes from the given input. It contains two files, <strong>Token.js and Lexer.js </strong>. Token.js represents a token in a source code of a program while Lexer.js uses RegEx to extract tokens from the given expression. </em>

- ast/ : <em>This folder contains AST.js file which is used to generate tree strcture of the given input.</em>

# Documetation about some of the functions -  (function name | filename )

- scan() | Lexer.js : This function is used to generate tokens from the given input and return Json array of tokens. 

```js
// if you want to get JSON on tokens generated using Lexer, use the below syntax
const _lex = require(./lexer/Lexer)
const input = "{1, 2, 3, [6...9]=1}"
console.log(_lex.scan(input))
```

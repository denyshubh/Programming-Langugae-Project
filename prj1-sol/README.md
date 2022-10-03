Name:		SHUBHAM KUMAR SINGH
B-Number:	B00955182
Email:		ssing163@binghamton.edu

# Project 1 

<strong> Project Status: Completed </strong>

## Modified Context Free Grammer (Left Factored)
```
    val : INT
        | '{' initializers '}'

    initializers : initializer (',' initializer )* , ?
        | empty

    initializer : '[' INT temp
        | val

    temp: ']' '=' val | '...' INT ']' '=' val
```

## Test Report

![Test Report](./test-result/test.png)

## Programming Details

-   Programming Language Used : JavaScript
-   Engine Used: Node JS

## Commands Used To Run Project
```bash
$ cd $HOME/i571c/prj1-sol
$ ./make.sh                                       # Run this bash script to execute all test
$ ./make.sh $HOME/i571c/extras/tests/complex.test # Run this script with
```

-   For getting JSON of <strong>AST / Lexeme</strong>, we need to configure environment variable OUT_TYPE as

```bash
# for getting json ast 
$ export OUT_TYPE="ast"

# for getting lexemes
$ export OUT_TYPE="tokens"
``` 

## Projects Files Description

- parser/ : <em>This folder contains two files, <strong>Parser.js and ASTParser.js. Parser.js </strong> uses the cfg grammer to generate and validate the input expresssion. Whereas, ASTParser.js generates syntax tree and returns json for the same. </em>

- lexer/ : <em>This folder contains code for generating lexemes from the given input. It contains two files, <strong>Token.js and Lexer.js </strong>. Token.js represents a token in a source code of a program while Lexer.js uses RegEx to extract tokens from the given expression. </em>

- ast/ : <em>This folder contains AST.js file which is used to generate tree strcture of the given input.</em>

## Documetation about some of the functions -  (function name | filename )

- scan() | Lexer.js : This function is used to generate tokens from the given input and return Json array of tokens. 

```js
// if you want to get JSON on tokens generated using Lexer, use the below syntax
const _lex = require(./lexer/Lexer)
const input = "{1, 2, 3, [6...9]=1}"
console.log(_lex.scan(input))
```

## Reference
[ Ruslan's Blog ](https://ruslanspivak.com/lsbasi-part1/)

[ Ruslan's GitHub ](https://github.com/ghaiklor/pascal-interpreter)

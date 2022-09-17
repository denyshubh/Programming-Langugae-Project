# Student Detail
```
Name:		SHUBHAM KUMAR SINGH
B-Number:	B00955182
Email:		ssing163@binghamton.edu
```
# Context Free Grammer
```
    val : INT
        | '{' initializers '}'

    initializers : initializer (',' initializer )* , ?
        | empty

    initializer : '[' INT temp
        | val

    temp: ']' '=' val | '...' INT ']' '=' val
```

# Reference
[ Ruslan's Blog ](https://ruslanspivak.com/lsbasi-part1/)

[ Ruslan's GitHub ](https://github.com/ghaiklor/pascal-interpreter)



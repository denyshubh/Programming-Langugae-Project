# i571c
Programming Language Project Repo 

# Context Free Grammer

val : INT
    | '{' initializers '}'

initializers : initializer (',' initializer )* , ?
    | empty

initializer : '[' INT temp
    | val

temp: ']' '=' val | '...' INT ']' '=' val



# Homework-2 Solution
-----------------------

1. Why does Date have a toJSON() method which seems to have the same functionality as toISOString()? Is it simply redundant or is it absolutely necessary? 5-points

#### Answer:

The ```toISOString()``` method returns a string in a simplified extended ISO format (ISO 8601) that is always 24 or 27 characters long. The timezone is always zero UTC offset and denoted by the suffix “Z”. On the other hand, ```toJSON()``` calls the object’s ```toISOString()``` method internally to return a string representing the Date object’s value. This method is intended to usefully serialize Date objects during JSON serialization. The serialized Date objects can then be deserialized using the ```Date()``` constructor or ```Date.parse()``` as the reviver of ```JSON.parse()```. <strong>The key difference between these two methods is that while there is no functional difference between the values returned by either method, toJSON() is necessary for JSON serialization.</strong> This means that if you want to serialize a Date object to JSON format, you would use the toJSON() method instead of the toISOString() method. 

Ref: [MDN - toJson()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON#description)

-----------------------
2. In Project 2 you are required to use a database for storing grades. Discuss would you use the filesystem instead. What would be the advantages and disadvantages of doing so? 10-points

#### Answer:
If you were to use a filesystem instead of a MongoDB for storing grades in Project 2, here are some potential advantages and disadvantages:

<strong>Advantages:</strong>

- Performance can be better than when using a database. For example, if you store large files in a database (like storing images of student), it may slow down performance because even a simple query to retrieve the list of files or filename will also load the file data.

<strong>Disadvantages:</strong>

- Data redundancy and inconsistency: Redundancy is the concept of repetition of data i.e. each data may have more than a single copy. The file system cannot control the redundancy of data as each user defines and maintains the needed files for a specific application to run.
- Reduced query processing: A database management system offers improved query processing compared to a file system.

<em>Even though MongoDB uses a filesystem underneath to store its data, this is abstracted from the user and handled very efficiently by MongoDB.</em>


-----------------------
3. Given the following code segment:
    ```js
        x = 8;
        obj1 = { x: 7, f: function(a) { return a+this.x; } }
        obj2 = { x: 5, f: function(a) { return a*this.x; } }
        f = obj1.f.bind(obj2);
        console.log(obj1.f(2) - obj2.f(3) + f(5));
    ```
    Assuming no earlier variable declarations, explain precisely why the output of the above JavaScript code when run in non-strict mode is 4. 15-points

#### Answer:
In this case, x, obj1, obj2, f are global variables.
The value of ```obj1.f(2)``` is calculated by calling the function ```f of object obj1``` with argument 2. The function returns the sum of its argument (a) and the value of property x of object obj1. So, it returns ```2 + 7 = 9.```

The value of ```obj2.f(3)``` is calculated by calling the function ```f of object obj2``` with argument 3. The function returns the product of its argument (a) and the value of property x of object obj2. So it returns ```3 * 5 = 15.```

The variable ```f ``` is assigned to the result of <strong>binding the function f from obj1 to obj2</strong>. This means that when f is called as a function, it will use obj2 as its this value. So when we call f(5), it returns ```5 + obj2.x = 5 + 5 =10.```

Finally, we have: obj1.f(2) - obj2.f(3) + f(5) = 9 -15 +10 =4
So when we run this code in non-strict mode, it outputs 4

-----------------------
4. Instead of having GradesDao clients use the makeGradesDao() factory method for creating GradesDao instances in grades-dao.ts, a student proposes making the constructor public so that clients can call it directly followed by a call to an async init() method on the instance to set up the database connection. Discuss the tradeoffs between the current API and the proposed API. Would one be preferred over the other? 10-points

#### Answer
- The current implentation provides less flexibility for clients on how they want to call the constructor method of our GradesDao class, if the client is able to directly call ```async init()``` method to setup connection to database, he can setup the parameters according to his will and gives more Control to clients.
- But there are some potential issues with directly calling the ```async init()``` function.
-- Requires careful handling by clients
-- Clients need to update code if implementation changes!
- on the other hand, the current implentation provides many advantages that overcomes the limitation of flexibilty. Some of them are -
-- Encapsulates implementation details
-- Better control over creation and initialization
-- Easier maintenance and updates

In conclusion, while the proposed API may provide more flexibility to clients, it also introduces potential issues. The current API provides better encapsulation and control over creation and initialization.

-----------------------
5. The documentation for nodejs modules mentions that if you want to export individual JavaScript entities from a module you can do so "by specifying additional properties on the special exports object". The documentation gives an example of a circle module:

    ```js 
        const { PI } = Math;
        exports.area = (r) => PI * r ** 2;
        exports.circumference = (r) => 2 * PI * r;
    ```

    The documentation subsequently makes clear that if you want to package up all your exports, then assigning directly to exports as in:
    
    ```js
        const { PI } = Math;
        exports = {
          area: (r) => PI * r ** 2;
          circumference: (r) => 2 * PI * r;
        }
    ```
    will not work. Instead it is necessary to assign to module.exports as in:
    ```js
        const { PI } = Math;
        module.exports = {
          area: (r) => PI * r ** 2;
          circumference: (r) => 2 * PI * r;
        }
    ```
    Why is it necessary to assign to module.exports and not simply to exports? 5-points

#### Answer:

In Node.js, ```module``` is a plain JavaScript object with an exports property. ```exports``` is a plain JavaScript variable that happens to be set to ```module.exports```. When you require a module in another file, the code within that module is executed, and only ```module.exports``` is returned.
If we try to access area, circumference on the exported object, an error is thrown because ```module.exports``` is empty. So, while module.exports and exports may seem interchangeable in the first import export pattern, they are not the same.

Ref: 
- [NodeJs module.export vs exports](https://www.builder.io/blog/nodejs-module-exports-vs-exports)
- [Stackoverflow - module exports vs exports](https://stackoverflow.com/questions/7137397/module-exports-vs-exports-in-node-js)

-----------------------
6. Write a function factorials(n) which can be used as in

    ```js
    for (const f of factorials(8)) console.log(f);
    ```
    to print out the first 8 factorials 1, 1, 2, 6, 24, 120, 720, 5040. Your function should work for any arbitrary positive integer (which is small enough so that the factorial can be represented in a JS integer number). The return value of factorials() is not allowed to be any kind of collection. 5-points

#### Answer

```js
function* factorials(n) {
    let i = 0;
    let result = 1;
    while (i < n) {
        yield result;
        i++;
        result *= i;
    }
}
```

-----------------------
7. Suggest improvements to the following code segments 15-points:
    A file copy:
    ```js
    	//assume readFile() and writeFile() are asynchronous
    	//functions returning promises:
    	function copyFile(srcPath, destPath) {
    	  readFile(srcPath)
              .then(data =>
                 writeFile(destPath, data)
    	     .then(() => console.log('copied')));
    	}
    ```
    The code segment:
    ```js
            const input = ...;
            const promise1 = asyncOperation(input);
            const promise2 = new Promise(resolve => 
              promise1.then(val => {
    	    // code which uses val
    	    resolve(val);
    	  })
            )
    	.catch(...);
    ```
    The code segment
    ```js
        const input = ...;
        asyncOperation(input)
          .then(val => handler1(val))
          .then(() => handler2())
          .then(val => handler3(val))
          .catch(...);      
    ```
    
#### Answer:
The code below uses ```async/await```.
```js
// File Copy
async function copyFile(srcPath, destPath) {
  try {
    const data = await readFile(srcPath);
    await writeFile(destPath, data);
    console.log('copied');
  } catch (error) {
    // handle error
  }
}

// The code segment
const input = ...;
try {
  const val = await asyncOperation(input);
  // code which uses val
} catch (error) {
  // handle error
}

// Code Segment
const input = ...;
try {
  const val1 = await asyncOperation(input);
  const val2 = await handler1(val1);
  await handler2();
  const val3 = await handler3(val2);
} catch (error) {
  // handle error
}
```
 
-----------------------
8. Discuss the ramifications of calling:
    - A synchronous function with the await keyword.
    - An async function without the await keyword. 10-points

#### Answer
Calling a synchronous function with the await keyword will still work. The await keyword makes promise-returning functions behave as though they’re synchronous by suspending execution until the returned promise is fulfilled or rejected. The resolved value of the promise is treated as the return value of the await expression.

On the other hand, calling an async function without using await will still execute synchronously. However, if we want our function to return a value, then using async makes a difference because it returns a promise and you need to either use await or get it in a .then() callback which is asynchronous.

-----------------------
9. Given that f() is an async function and transformArgs() is a synchronous function which transforms its list argument, compare:
    ```js
        f_wrapper(...args) {
          const xArgs = transformArgs(args);
          return f(...xArgs);
        }
    ```
    with
    ```js
        async f_wrapper(...args) {
          const xArgs = transformArgs(args);
          return await f(...xArgs);
        }
    ```
    10-points

#### Answer
```js
f_wrapper(...args) {
  const xArgs = transformArgs(args);
  return f(...xArgs);   // return Promise
}
async f_wrapper(...args) {
  const xArgs = transformArgs(args);
  return await f(...xArgs); // returns value
}
```
The difference between the two versions of f_wrapper is that the first one returns a promise that resolves to the value returned by f, while the second one returns the resolved value of the promise returned by f.

-----------------------
10. Discuss the validity of the following statements. 15-points

- The promise returned by Promise.all() will become settled after a minimum time which is the sum of the times required for settlement of each of its individual argument promises.</br></br>
No, that statement is incorrect. The promise returned by Promise.all() will become settled after the maximum time required for settlement of each of its individual argument promises. This means that it will wait for all the promises to settle before settling itself.
</br></br>
- this for a fat-arrow function can be changed using bind().
</br></br>No, that statement is incorrect. The value of this inside a fat-arrow (=>) function cannot be changed using bind(). Fat-arrow functions do not have their own this value and instead inherit it from the enclosing lexical scope.
</br></br>
- The return value of a then() is always a promise.
</br></br>Yes, that's correct. The return value of a then() method is always a new promise
</br></br>
- It is impossible to wrap an asynchronous function within a synchronous function.
</br></br>No, that's incorrect. Below is an example to counter the statement
```js
function syncFunction() {
  async function asyncFunction() {
    return new Promise(resolve => setTimeout(() => resolve('Async result'), 1000));
  }
  asyncFunction().then(result => console.log(result));
}
syncFunction();
```
</br></br>
- In modern JavaScript, having both call() and apply() is redundant; i.e. each one can be implemented in terms of the other.
 </br></br>Yes, that's correct. Both call() and apply() methods can be used to invoke a function with a specified ```this``` value and arguments. The main difference between the two methods is how the arguments are passed to the function: call() takes a list of arguments while apply() takes an array of arguments.
</br></br>

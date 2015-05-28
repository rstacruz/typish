# typish

Yet another typewriter simulator. This one supports `span`s though for syntax highlighting.<br>
**[Demo →](http://jsbin.com/qoranoyuwe/edit?js,output)**

```js
var typish = require('typish');

function repeat() {
  typish('#container')
    .type('var x ', 'keyword')
    .type('= ', 'operator')
    .type('function')
    .type('() {\n', 'operator')
    .type('  alert')
    .type('(', 'operator')
    .type('"hello world', 'string')
    .wait(10)
    .del(5)
    .type('mundo."', 'string')
    .wait(10)
    .type(');\n}', 'operator')
    .then(repeat)
}

repeat();
```

[![Status](http://img.shields.io/travis/rstacruz/typish/master.svg)](https://travis-ci.org/rstacruz/typish "See test builds")
[![npm version](http://img.shields.io/npm/v/typish)](https://npmjs.org/package/typish "View this project on npm")

## API cheatsheet

```js
typish(element)
  .speed(50)         // sets base speed in milliseconds
  .type("hi")        // types something letter by letter
  .type("hi", "red") // types, with classname set to 'red'
  .type("hi", 0)     // types immediately
  .del()             // delete 1 character
  .del(4)            // delete 4 characters
  .wait()            // pauses for a while
  .wait(10)          // pauses (10x longer)
  .clear()           // clears everything
  .clear(0)          // clears everything immediately (speed is 0)
  .then(function)    // executes something asynchronously
```

<!-- include: index.js -->

## typish()
> `typish(element)`

Starts typish. `element` may be a DOM element, selector, or a jQuery
object.

```js
typish('#container')
typish(el)
```

### type()
> `type(text, [className, speed])`

Types some text. If `className` is given, it'll start a new span.
You can also give a different `speed` to make it faster or slower.

```js
typish(el)
  .type('hello')
  .type('hello', 'keyword')
  .type('hello', 10)
  .type('hello', 'keyword', 10)
```

### del()
> `del([count, speed])`

Deletes characters. if `count` is given, it'll delete that many
characters.  If `speed` is given, that's the speed it'll run on.

```js
typish('.box')
  .type('hello John')
  .del(4)
  .type('Sherlock')
```

### wait()
> `wait([speed])`

Waits a while. You may give an optional `speed` argument.

```js
typish(el)
  .type('hello')
  .wait()
  .type('there')
```

### clear()
> `clear([speed])`

Clears the entire thing one letter at a time. To clear everything
instantly, use `.clear(0)`.

```js
typish('.box')
  .type('hello.')
  .clear()
```

### then()
> `then(function)`

Executes a `function` asynchronously.

```js
typish('#box')
  .type('hello')
  .then(popupSomething)
  .wait()
  .type('there')
  .then(popupSomethingAgain)
```

### speed()
> `speed(ms)`

Sets the base speed. All `speed` arguments will be multiplied by this
number.

```js
typish(el)
  .speed(50)
  .type('hello')
```

### queue()
> `queue(fn(next))`

Queues a command for execution. The function `fn` will be invoked, where
the `next` parameter should be ran to move onto the next thing on queue.

```js
typish(el)
  queue(function (next) {
    this.typeSync('hi');
    setTimeout(next, 100);
  })
```

### defer()
> `defer(next, [speed])`

Waits then runs `next`. Useful inside queue().

```js
typish(el)
  .queue(function (next) {
    //dosomething
    this.defer(next);
  })
```

<!-- /include -->

## Similar projects

* [jquery.typer.js](https://github.com/layervault/jquery.typer.js)
    * pro: easier to configure
    * con: jQuery dependency
    * con: doesn't support spans
* [malarkey](https://github.com/yuanqing/malarkey)
    * pro: smaller footprint in bytes
    * con: doesn't support spans

## Thanks

**typish** ¬© 2015+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/typish/contributors

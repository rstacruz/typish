# typish

Yet another typer. This one supports `span`s though for syntax highlighting.

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

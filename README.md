# typish

Yet another typewriter simulator. **[Demo →](http://ricostacruz.com/typish)**

Unlike others like it, typish supports inserting HTML elements. This means you'll be able to do pseudo-syntax highlighting or insert buttons, like below.

![](https://github.com/rstacruz/typish/blob/gh-pages/screencast.gif)

```js
var typish = require('typish');

function repeat() {
  typish('#container')
    .type('hello stranger')
    .del(8)
    .type('you. ')
    .type('continue', '<a href="next.html">')
    .wait(50)
    .then(repeat)
}

repeat();
```

[![Status](http://img.shields.io/travis/rstacruz/typish/master.svg)](https://travis-ci.org/rstacruz/typish "See test builds")
[![npm version](http://img.shields.io/npm/v/typish.svg)](https://npmjs.org/package/typish "View this project on npm")

## API cheatsheet

```js
typish(element)
  .speed(50)         // sets base speed in milliseconds
  .type("hi")        // types something letter by letter
  .type("hi", "red") // types, with classname set to 'red'
  .type("hi", "<b>") // types, uses a custom tag
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
object. This returns a `typish` object that you can run methods on.

```js
typish('#container')
typish($("#box"))
typish(el)
```

A *typish* instance also has the following variables:

- `this.el`: the element
- `this.length`: how many characters are present at the moment
- `this.last`: the last `<span>` in the box

### type()
> `type(text, [element, speed])`

Types some text. If `element` is given, it'll start a new span.
You can also give a different `speed` to make it faster or slower.

```js
typish(el)
  .type('hello')
  .type('hello', 'keyword')
  .type('hello', 10)
  .type('hello', 'keyword', 10)
```

When a name is passed to the `element` parameter, it'll be used
as a class name for a `<span>`.

```js
typish(el)
  .type('Jack', 'name')

<div id='box'><span class='name'>Jack</span></div>
```

Each `.type()` call creates a new span element.

```js
typish(el)
  .type('Jack ', 'name')
  .type('Sparrow', 'last')

<div id='box'>
  <span class='name'>Jack </span>
  <span class='last'>Sparrow</span>
</div>
```

The parameter `element` can also be an HTML tag.

```js
typish('#box')
  .type('download me', '<a href="download.html">')

<div id='box'>
  <a href="download.html">download me</a>
</div>
```

The `speed` argument is multiplied by whatever you set on [speed()].
Doing `.type('hello', 1/2)` will type a message 2x as fast as normal.

```js
typish('#box')
  .type('download me', '<b>', 1/2)
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

The `speed` argument is multiplied by the time it takes to type one
character (ie, whatever you set on [speed()]). Doing `.del(10, 1/2)`
will delete 10 characters 2x as fast as it types.

### wait()
> `wait([speed])`

Waits a while. This waits the equivalent of whatever you set in
`.speed()`, that is, it waits exactly the time it takes to type 1
character.

The `speed` argument is multiplied by the time it takes to type one
character (ie, whatever you set on [speed()]). Doing `.wait(10)` pauses
for the time it takes to type 10 characters.

```js
typish(el)
  .type('hello')
  .wait(10)
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

Also see [type()] for an explanation on the `speed` parameter.

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
typish('.box')
  .speed(50)
  .type('hello')
```

You can call `speed()` in the middle of an animation to slow it down or
speed it up.

```js
typish('.box')
  .speed(50)
  .type('hello ')
  .speed(100)
  .type('world')
```

### queue()
> `queue(fn(next))`

Queues a command for execution. The function `fn` will be invoked, where
the `next` parameter should be ran to move onto the next thing on queue.

```js
typish(el)
  .queue(function (next) {
    this.el.className += ' -fade-in'
    setTimeout(next, 100)
  })
```

This is used for asynchronous functions. See [then()] if you would like to
execute something synchronously.

### defer()
> `defer(next, [speed])`

Waits then runs `next`. Useful inside [queue()].

```js
typish(el)
  .queue(function (next) {
    //dosomething
    this.defer(next)
  })
```

See [type()] for an explanation of the `speed` parameter.

<!-- /include -->

## Blinking cursor

This is optional, and it's done via CSS. Check out [typish.scss](typish.scss)
for some helpers on getting this to work.

```scss
@import 'typish';
.box {
  @include typish-cursor($color: #a83);
}

@include typish-keyframes;
```

## Similar projects

* [jquery.typer.js](https://github.com/layervault/jquery.typer.js)
    * pro: easier to configure
    * con: jQuery dependency
    * con: can't configure speed while it types
    * con: doesn't support spans
* [malarkey](https://github.com/yuanqing/malarkey)
    * pro: smaller footprint in bytes
    * con: doesn't support spans
* [typed.js](http://www.mattboldt.com/demos/typed-js/)
    * pro: easier to setup, just an array of sentences
    * con: can't delete parts of a message
    * con: doesn't support spans

## Thanks

**typish** © 2015+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/typish/contributors

[type()]: #type
[speed()]: #speed
[then()]: #then
[queue()]: #queue

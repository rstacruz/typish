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

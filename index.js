;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.typish = factory();
  }
}(this, function () {

  /***
   * typish() : typish(element)
   * Starts typish. `element` may be a DOM element, selector, or a jQuery
   * object. This returns a `typish` object that you can run methods on.
   *
   *     typish('#container')
   *     typish(el)
   */

  function typish(el, options) {
    if (!(this instanceof typish))
      return new typish(el, options);
    
    if (typeof el === 'string')
      el = document.querySelector(el);

    if (el[0] && el[0].nodeName)
      el = el[0];
    
    if (!el)
      throw new Error("Unknown element");
    
    this.el = el;
    this.stack = [];
    this.last = null;
    this._speed = typish.defaultSpeed;
    this.length = 0;
    this.iterations = 0;
    this.classNames = {
      typing: '-typish-typing',
      waiting: '-typish-waiting'
    };

    this.clearAllSync();
  }

  typish.defaultSpeed = 50;

  /**
   * type() : type(text, [element, speed])
   * Types some text. If `element` is given, it'll start a new span.
   * You can also give a different `speed` to make it faster or slower.
   *
   *     typish(el)
   *       .type('hello')
   *       .type('hello', 'keyword')
   *       .type('hello', 10)
   *       .type('hello', 'keyword', 10)
   *
   * When a name is passed to the `element` parameter, it'll be used
   * as a class name for a `<span>`.
   *
   *     typish(el)
   *       .type('Jack', 'name')
   *
   *     <div id='box'><span class='name'>Jack</span></div>
   *
   * Each `.type()` call creates a new span element.
   *
   *     typish(el)
   *       .type('Jack ', 'name')
   *       .type('Sparrow', 'last')
   *
   *     <div id='box'>
   *       <span class='name'>Jack </span>
   *       <span class='last'>Sparrow</span>
   *     </div>
   *
   * The parameter `element` can also be an HTML tag.
   *
   *     typish('#box')
   *       .type('download me', '<a href="download.html">')
   *
   *     <div id='box'>
   *       <a href="download.html">download me</a>
   *     </div>
   */

  typish.prototype.type = function (str, element, speed) {
    if (typeof element === 'number') {
      speed = element;
      element = undefined;
    }

    var letters, self = this;

    // optimize: if speed is 0, do it all in one go
    if (speed === 0)
      letters = [str];
    else
      letters = str.split('');

    for (var i = 0, len = letters.length; i < len; i++) {
      var letter = letters[i];
      (function (letter, i) {
        self.queue(function (next) {
          if (i === 0) {
            addClass(self.el, self.classNames.typing);
            self.spanSync(element);
          }

          self.typeSync(letter);

          if (i === len-1) {
            removeClass(self.el, self.classNames.typing);
          }

          self.defer(next, speed);
        });
      }(letter, i));
    }

    return this;
  };

  /**
   * del() : del([count, speed])
   * Deletes characters. if `count` is given, it'll delete that many
   * characters.  If `speed` is given, that's the speed it'll run on.
   *
   *     typish('.box')
   *       .type('hello John')
   *       .del(4)
   *       .type('Sherlock')
   */

  typish.prototype.del = function (n, speed) {
    if (typeof n === 'undefined') n = 1;

    for (var i = 0; i < n; i++) {
      this.queue(function (next) {
        this.delSync();
        this.defer(next, speed);
      });
    }

    return this;
  };

  /**
   * wait() : wait([speed])
   * Waits a while. You may give an optional `speed` argument.
   *
   *     typish(el)
   *       .type('hello')
   *       .wait()
   *       .type('there')
   */

  typish.prototype.wait = function (speed) {
    return this.queue(function (next) {
      addClass(this.el, this.classNames.waiting);
      this.defer(function() {
        removeClass(this.el, this.classNames.waiting);
        next();
      }, speed);
    });
  };

  /**
   * clear() : clear([speed])
   * Clears the entire thing one letter at a time. To clear everything
   * instantly, use `.clear(0)`.
   *
   *     typish('.box')
   *       .type('hello.')
   *       .clear()
   */

  typish.prototype.clear = function (speed) {
    var self = this;

    if (speed === 0) {
      return this.queue(function (next) {
        this.clearAllSync();
        next();
      });
    }

    return this.queue(function (next) {
      function bksp() {
        if (self.length === 0) return next();
        self.delSync();
        self.defer(bksp);
      }
      bksp();
    });
  };

  /**
   * then() : then(function)
   * Executes a `function` asynchronously.
   *
   *     typish('#box')
   *       .type('hello')
   *       .then(popupSomething)
   *       .wait()
   *       .type('there')
   *       .then(popupSomethingAgain)
   */

  typish.prototype.then = function (fn) {
    return this.queue(function (next) {
      fn.apply(this);
      next();
    });
  };

  /**
   * speed() : speed(ms)
   * Sets the base speed. All `speed` arguments will be multiplied by this
   * number.
   *
   *     typish(el)
   *       .speed(50)
   *       .type('hello')
   */

  typish.prototype.speed = function (n) {
    return this.then(function () {
      this._speed = n;
      return this;
    });
  };

  /**
   * queue() : queue(fn(next))
   * Queues a command for execution. The function `fn` will be invoked, where
   * the `next` parameter should be ran to move onto the next thing on queue. 
   *
   *     typish(el)
   *       .queue(function (next) {
   *         this.typeSync('hi');
   *         setTimeout(next, 100);
   *       })
   */

  typish.prototype.queue = function (fn) {
    // Adds a command to the buffer, and executes it if it's
    // the only command to be ran.
    var self = this;
    var stack = this.stack;
    stack.push(fn);
    if (stack.length === 1) {
      this.iterations++;
      fn.call(self, next);
    }
    return this;

    // Moves onto the next command in the buffer.
    function next() {
      stack.shift();
      if (stack.length) {
        stack[0].call(self, next);
        self.iterations++;
      }
    }
  };

  /**
   * defer() : defer(next, [speed])
   * Waits then runs `next`. Useful inside queue().
   *
   *     typish(el)
   *       .queue(function (next) {
   *         //dosomething
   *         this.defer(next);
   *       })
   *
   */

  typish.prototype.defer = function (next, speed) {
    if (typeof speed === 'number')
      speed *= this._speed;
    else
      speed = this._speed;

    var self = this;
    setTimeout(function() { next.call(self); }, speed);
    return this;
  };

  /*
   * Internal: Adds a span (synchronous).
   */

  typish.prototype.spanSync = function (element) {
    var span;

    if (element && element.substr(0,1) === '<') {
      var div = document.createElement('div');
      div.innerHTML = element;
      span = div.children[0];
      if (!span) span = document.createElement('span');
    } else {
      span = document.createElement('span');
      if (element)
        span.className = element.replace(/\./, ' ');
    }

    this.el.appendChild(span);
    this.last = span;
    return this;
  };

  /*
   * Internal: Adds a character (synchronous).
   */

  typish.prototype.typeSync = function (ch, className) {
    if (className) {
      this.spanSync(className);
    } else if (!this.last) {
      this.spanSync(); 
    }

    this.length += ch.length;

    ch = ch
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    this.last.innerHTML += ch;
    return this;
  };

  /*
   * Internal: deletes a character (synchronous).
   */

  typish.prototype.delSync = function () {
    if (!this.last) return this;

    this.length--;

    var str = this.last.innerHTML;
    if (str.length === 1) return this.popSpanSync();

    this.last.innerHTML = str.substr(str, str.length - 1);
    if (str.length === 0) return this.popSpanSync();

    return this;
  };

  /*
   * Internal: removes the last span (synchronous).
   */

  typish.prototype.popSpanSync = function () {
    if (!this.last) return this;

    this.el.removeChild(this.last);
    if (this.el.children.length)
      this.last = this.el.children[this.el.children.length-1];
    else
      this.last = undefined;

    return this;
  };

  /*
   * Internal: clears everything (synchronous).
   */

  typish.prototype.clearAllSync = function () {
    this.el.innerHTML = '';
    this.length = 0;
  };

  return typish;

  function removeClass (el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      var expr =
        new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi');

      el.className = el.className.replace(expr, ' ')
        .replace(/(^\s*)|(\s*$)/g, '')
        .replace(/\s{2,}/g, ' ');
    }
  }

  function addClass (el, className) {
    if (el.classList)
      el.classList.add(className);
    else {
      el.className = (el.className + ' ' + className)
        .replace(/(^\s*)|(\s*$)/g, '')
        .replace(/\s{2,}/g, ' ');
    }
  }

}));

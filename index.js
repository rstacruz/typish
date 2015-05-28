;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.typish = factory();
  }
}(this, function () {
  function typish(el, options) {
    if (!(this instanceof typish))
      return new typish(el, options);
    
    if (typeof el === 'string')
      el = document.querySelector(el);
    
    if (!el)
      throw new Error("Unknown element");
    
    this.el = el;
    this.stack = [];
    this.last = null;
    this._speed = 10;
    this.iterations = 0;
  }

  /**
   * types some text.
   *
   *   typish(el)
   *     .type('hello')
   */

  typish.prototype.type = function (str, className, speed) {
    var letters = str.split('');

    if (className)
      this.queue(function (next) {
        this.spanSync(className);
        next();
      });

    for (var i = 0, len = letters.length; i < len; i++) {
      var letter = letters[i];
      (function (letter) {
        this.queue(function (next) {
          this.typeSync(letter);
          this.defer(next, speed);
        });
      }.bind(this)(letter));
    }

    return this;
  }

  /**
   * queues a command for execution.
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
   * Waits for `speed` ms, then runs `next`. Useful inside queue.
   *
   *   typish(el)
   *     .queue(function (next) {
   *       //dosomething
   *       this.defer(next);
   *     })
   *
   */

  typish.prototype.defer = function (next, speed) {
    if (typeof speed === 'number')
      speed *= this._speed;
    else
      speed = this._speed;

    setTimeout(next, speed);
    return this;
  };

  /**
   * sets the base speed.
   *
   *   typish(el)
   *     .speed(50)
   *     .type('hello')
   */

  typish.prototype.speed = function (n) {
    if (typeof n === 'undefined') return this._speed;
    this._speed = n;
    return this;
  }

  /*
   * executes something asynchronously.
   */

  typish.prototype.then = function (fn) {
    return this.queue(function (next) {
      fn.apply(this);
      next();
    });
  };

  /**
   * waits.
   *
   *   typish(el)
   *     .type('hello')
   *     .wait()
   *     .type('there')
   */

  typish.prototype.wait = function (speed) {
    return this.queue(function (next) {
      this.defer(next, speed);
    });
  };

  /**
   * deletes characters. if `n` is given, it'll delete that many characters.
   * If `speed` is given, that's the speed it'll run on.
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
   * returns the current length (synchronous)
   */

  typish.prototype.len = function (n, speed) {
    if ('textContent' in this.el)
      return this.el.textContent.length;
    else
      return this.el.innerText.length;
  };

  /**
   * clears the entire thing.
   */

  typish.prototype.clear = function (speed) {
    var self = this;

    if (speed === 0) {
      return this.queue(function (next) {
        this.el.innerHTML = '';
        next();
      });
    }

    return this.queue(function (next) {
      function bksp() {
        if (self.len() === 0) return next();
        self.delSync();
        self.defer(bksp);
      }
      bksp();
    });
  };

  /**
   * adds a span (synchronous)
   */

  typish.prototype.spanSync = function (className) {
    var span = document.createElement('span');
    if (className)
      span.className = className.replace(/\./, ' ');
    
    this.el.appendChild(span);
    this.last = span;
    return this;
  };

  /**
   * adds a character (synchronous)
   */

  typish.prototype.typeSync = function (ch, className) {
    if (className) {
      this.spanSync(className);
    } else if (!this.last) {
      this.spanSync(); 
    }

    this.last.innerHTML += ch;
    return this;
  };

  /*
   * deletes a character (synchronous)
   */

  typish.prototype.delSync = function () {
    if (!this.last) return this;

    var str = this.last.innerHTML;
    if (str.length === 1) return this.popSpanSync();

    this.last.innerHTML = str.substr(str, str.length - 1);
    if (str.length === 0) return this.popSpanSync();

    return this;
  };

  /**
   * Internal: removes the last span (synchronous)
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

  return typish;
}));

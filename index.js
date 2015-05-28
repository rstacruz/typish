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
}

/**
 * adds a span
 */

typish.prototype.span = function (className) {
  var span = document.createElement('span');
  span.className = className || '';
  
  this.el.appendChild(span);
  this.last = span;
  return this;
};

/**
 * adds a character
 */

typish.prototype.char = function (ch) {
  if (!this.last) this.span();
  this.last.innerHTML += ch;
  return this;
};

/*
 * deletes a character
 */

typish.prototype.bksp = function () {
  if (!this.last) return this;

  var str = this.last.innerHTML;
  if (str.length === 1) return this.removeSpan();
  this.last.innerHTML = str.substr(str, str.length - 1);
  return this;
};

/**
 * Internal: removes the last span
 */

typish.prototype.removeSpan = function () {
  if (!this.last) return this;

  this.el.removeChild(this.last);
  if (this.el.children.length) {
    this.last = this.el.children[this.el.children.length-1];
  } else {
    this.last = undefined;
  }

  return this;
};

module.exports = typish;

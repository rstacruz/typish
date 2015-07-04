if (typeof process === 'object') {
  global.expect = require('expect')
  global.typish = require('../index')
  require('expect-html-equal')
  require('mocha-jsdom')()
} else {
  if (typeof global === 'undefined') window.global = window
  window.require = function () { /* noop */ }
}


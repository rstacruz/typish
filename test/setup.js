if (typeof process === 'object') {
  global.expect = require('chai').expect
  global.typish = require('../index')
  require('mocha-jsdom')()
} else {
  window.expect = window.chai.expect
  window.require = function () { /*noop*/ }
}

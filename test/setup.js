if (typeof process === 'object') {
  global.expect = require('expect')
  global.typish = require('../index')
  require('mocha-jsdom')()
} else {
  window.require = function () { /*noop*/ }
}

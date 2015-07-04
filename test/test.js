/* global describe, it, beforeEach */
require('./setup') /* global typish, expect */

describe('typish', function () {
  var div, t

  beforeEach(function () {
    typish.defaultSpeed = 1
    div = document.createElement('div')
    t = undefined
  })

  it('typeSync()', function () {
    t = typish(div)
      .spanSync('keyword')
      .typeSync('var x')

    expect(t.el.innerHTML).toHtmlEqual(
      '<span class="keyword">var x</span>')
  })

  it('typeSync() auto span insertion', function () {
    t = typish(div)
      .typeSync('var x')

    expect(t.el.innerHTML).toHtmlEqual(
      '<span>var x</span>')
  })

  it('typeSync() escaping', function () {
    t = typish(div)
      .typeSync('var <x>')

    expect(t.el.innerHTML).toHtmlEqual(
      '<span>var &lt;x&gt;</span>')
  })

  it('typeSync() line breaks', function () {
    t = typish(div)
      .typeSync('a\nb')

    expect(t.el.innerHTML).toHtmlEqual('<span>a<br>b</span>')
    expect(t.length).toHtmlEqual(3)
  })

  it('delSync() once', function () {
    t = typish(div)
      .spanSync('keyword')
      .typeSync('var x')
      .delSync()
      .delSync()

    expect(t.el.innerHTML).toHtmlEqual(
      '<span class="keyword">var</span>')
  })

  it('delSync() then type after', function () {
    t = typish(div)
      .typeSync('v')
      .delSync()

    expect(t.el.innerHTML).toHtmlEqual('')
    expect(t.last).undefined

    t.typeSync('k')

    expect(t.el.innerHTML).toHtmlEqual(
      '<span>k</span>')
  })

  it('multiple span', function () {
    t = typish(div)
      .spanSync('keyword')
      .typeSync('var x')
      .spanSync('op')
      .typeSync('= y')

    expect(t.el.innerHTML).toHtmlEqual(
      '<span class="keyword">var x</span><span class="op">= y</span>')
  })

  it('del multiple', function () {
    t = typish(div)
      .spanSync('keyword')
      .typeSync('var x')
      .spanSync('keyword')
      .typeSync('=y')
      .delSync()
      .delSync()
      .delSync()
      .delSync()

    expect(t.el.innerHTML).toHtmlEqual(
      '<span class="keyword">var</span>')
  })

  it('char without span', function () {
    t = typish(div)
      .typeSync('var x')

    expect(t.el.innerHTML).toHtmlEqual(
      '<span>var x</span>')
  })

  it('last del throws no errors', function () {
    t = typish(div)
      .delSync()

    expect(t.el.innerHTML).toHtmlEqual('')
  })

  it('type()', function (next) {
    t = typish(div)
      .type('hi')
      .then(function () {
        expect(t.el.innerHTML).toHtmlEqual('<span>hi</span>')
      })
      .type('yo')
      .then(function () {
        expect(t.el.innerHTML).toHtmlEqual('<span>hi</span><span>yo</span>')
        next()
      })
  })

  it('type() with class', function (next) {
    t = typish(div)
      .type('hi')
      .then(function () {
        expect(t.el.innerHTML).toHtmlEqual('<span>hi</span>')
      })
      .type('yo', 'keyword')
      .then(function () {
        expect(t.el.innerHTML).toHtmlEqual('<span>hi</span><span class="keyword">yo</span>')
        next()
      })
  })

  it('del()', function (next) {
    t = typish(div)
      .type('var')
      .type('=')
      .del(2)
      .then(function () {
        expect(t.el.innerHTML).toHtmlEqual('<span>va</span>')
        expect(t.iterations).toHtmlEqual(6)
        next()
      })
  })

  it('length', function () {
    t = typish(div)
      .typeSync('var')
      .spanSync()
      .typeSync('=')

    expect(t.length).toHtmlEqual(4)
  })

  it('clear()', function (next) {
    t = typish(div)
      .type('var')
      .type('=')
      .clear()
      .then(function () {
        expect(t.el.innerHTML).toHtmlEqual('')
        next()
      })
  })

  it('clear() and type after', function (next) {
    t = typish(div)
      .type('var')
      .type('=')
      .clear()
      .type('k')
      .then(function () {
        expect(t.el.innerHTML).toHtmlEqual('<span>k</span>')
        next()
      })
  })

  it('clear() with speed = 0', function (next) {
    t = typish(div)

    t.spanSync()
      .typeSync('var')
      .typeSync('=')
      .clear(0)
      .then(function () {
        expect(t.el.innerHTML).toHtmlEqual('')
        next()
      })
  })

  it('speed()', function (next) {
    t = typish(div)
      .speed(0)
      .type('var')
      .then(function () {
        next()
      })
  })

  it('type() html tags', function (next) {
    t = typish(div)
      .type('get', '<a href="download.html">')
      .then(function () {
        expect(t.el.innerHTML).toHtmlEqual('<a href="download.html">get</a>')
        next()
      })
  })

  it('type() invalid html tags', function (next) {
    t = typish(div)
      .type('get', '<')
      .then(function () {
        expect(t.el.innerHTML).toHtmlEqual('<span>get</span>')
        next()
      })
  })

  it('type() sets "typing" classname', function (next) {
    setTimeout(function () {
      expect(t.el.className).toInclude('-typish-typing')
    }, 50)

    t = typish(div)
      .speed(20)
      .type('abcdef')
      .then(function () { next() })
  })

  it('type() clears classname', function (next) {
    t = typish(div)
      .type('get')
      .then(function () {
        expect(t.el.className).toEqual('')
        next()
      })
  })

  it('type() fast', function (next) {
    t = typish(div)
      .type('get', 0)
      .then(function () {
        expect(this.el.innerHTML).toHtmlEqual('<span>get</span>')
        // type + then
        expect(this.iterations).toHtmlEqual(2)
        next()
      })
  })
})

var expect = require('chai').expect
require('mocha-jsdom')()

var typish, div, t

describe('typish', function () {

  beforeEach(function () {
    typish = require('../index')
    div = document.createElement('div')
  })

  it('works', function () {
    t = typish(div)
      .span('keyword')
      .char('var x')

    expect(t.el.innerHTML).eql(
      '<span class="keyword">var x</span>')
  })

  it('bksp once', function () {
    t = typish(div)
      .span('keyword')
      .char('var x')
      .bksp()
      .bksp()

    expect(t.el.innerHTML).eql(
      '<span class="keyword">var</span>')
  })

  it('multiple span', function () {
    t = typish(div)
      .span('keyword')
      .char('var x')
      .span('op')
      .char('= y')

    expect(t.el.innerHTML).eql(
      '<span class="keyword">var x</span><span class="op">= y</span>')
  })

  it('bksp multiple', function () {
    t = typish(div)
      .span('keyword')
      .char('var x')
      .span('keyword')
      .char('=y')
      .bksp()
      .bksp()
      .bksp()
      .bksp()

    expect(t.el.innerHTML).eql(
      '<span class="keyword">var</span>')
  })

  it('char without span', function () {
    t = typish(div)
      .char('var x')

    expect(t.el.innerHTML).eql(
      '<span>var x</span>')
  })

  it('last bksp throws no errors', function () {
    t = typish(div)
      .bksp()

    expect(t.el.innerHTML).eql('')
  })
})

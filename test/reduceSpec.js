var reduce = require('../reduce')
var expect = require('chai').expect
var _ = require('underscore')

require('es6-promise').polyfill();

describe('reduce', function () {
  it('filters an array', function () {
    var items = [1, 2, 3, 4]

    return reduce(items, function (sum, n) { return sum + n }, 0).then(function (results) {
      expect(results).to.eql(10)
    })
  })

  it('filters an array with promise predicate', function () {
    var items = [1, 2, 3, 4]

    return reduce(items, function (sum, n) { return Promise.resolve(sum + n) }, 0).then(function (results) {
      expect(results).to.eql(10)
    })
  })

  it('filters an empty array', function () {
    var items = []

    return reduce(items, function (sum, n) { return sum + n }, 0).then(function (results) {
      expect(results).to.eql(0)
    })
  })

  it("doesn't hold up the main thread", function () {
    var lastTime = Date.now()
    var times = []

    setInterval(function () {
      var thisTime = Date.now()
      var timeSinceLastInterval = thisTime - lastTime
      times.push(timeSinceLastInterval)
      lastTime = thisTime
    }, 10)

    var items = _.range(0, 50)

    return reduce(items, function (sum, n) {
      var startTime = Date.now()
      while ((Date.now() - startTime) <= 5) {
      }
      return sum + n
    }, 0).then(function () {
      expect(times.length).to.be.greaterThan(1)
      expect(_.max(times)).to.be.lessThan(20)
    })
  })
})

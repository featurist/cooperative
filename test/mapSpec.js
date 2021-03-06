var map = require('../map')
var expect = require('chai').expect
var _ = require('underscore')

require('es6-promise').polyfill();

describe('map', function () {
  it('maps an array', function () {
    var items = [1, 2, 3, 4]

    return map(items, function (n) { return -n }).then(function (results) {
      expect(results).to.eql([-1, -2, -3, -4])
    })
  })

  it('maps an array with promise mapper', function () {
    var items = [1, 2, 3, 4]

    return map(items, function (n) { return Promise.resolve(-n) }).then(function (results) {
      expect(results).to.eql([-1, -2, -3, -4])
    })
  })

  it('maps an empty array', function () {
    var items = []

    return map(items, function (n) { return -n }).then(function (results) {
      expect(results).to.eql([])
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

    return map(items, function (n) {
      var startTime = Date.now()
      while ((Date.now() - startTime) <= 5) {
      }
      return -n
    }).then(function () {
      expect(times.length).to.be.greaterThan(1)
      expect(_.max(times)).to.be.lessThan(20)
    })
  })
})

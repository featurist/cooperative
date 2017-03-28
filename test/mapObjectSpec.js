var mapObject = require('../mapObject')
var expect = require('chai').expect
var _ = require('underscore')

describe('mapObject', function () {
  it('maps an array', async function () {
    var items = {a: 1, b: 2}

    var results = await mapObject(items, (n) => -n)
    expect(results).to.eql({a: -1, b: -2})
  })

  it('maps an array with promise mapper', async function () {
    var items = {a: 1, b: 2}

    var results = await mapObject(items, (n) => Promise.resolve(-n))
    expect(results).to.eql({a: -1, b: -2})
  })

  it('maps an empty array', async function () {
    var items = {}

    var results = await mapObject(items, (n) => -n)
    expect(results).to.eql({})
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

    var items = _.object(_.range(0, 50).map(i => ['key' + i, i]))

    return mapObject(items, function (n) {
      var startTime = Date.now()
      while ((Date.now() - startTime) <= 5) {
      }
      return -n
    }).then(() => {
      expect(times.length).to.be.greaterThan(1)
      expect(_.max(times)).to.be.lessThan(20)
    })
  })
})

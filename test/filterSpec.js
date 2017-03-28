var filter = require('../filter')
var expect = require('chai').expect
var _ = require('underscore')

describe('filter', function () {
  it('filters an array', async function () {
    var items = [1, 2, 3, 4]

    var results = await filter(items, (n) => n % 2 == 0)
    expect(results).to.eql([2, 4])
  })

  it('filters an array with promise predicate', async function () {
    var items = [1, 2, 3, 4]

    var results = await filter(items, (n) => Promise.resolve(n % 2 == 0))
    expect(results).to.eql([2, 4])
  })

  it('filters an empty array', async function () {
    var items = []

    var results = await filter(items, (n) => n % 2 == 0)
    expect(results).to.eql([])
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

    return filter(items, function (n) {
      var startTime = Date.now()
      while ((Date.now() - startTime) <= 5) {
      }
      return n % 2 == 0
    }).then(() => {
      expect(times.length).to.be.greaterThan(1)
      expect(_.max(times)).to.be.lessThan(20)
    })
  })
})

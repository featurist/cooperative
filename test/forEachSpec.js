var forEach = require('../forEach')
var expect = require('chai').expect
var _ = require('underscore')

describe('forEach', function () {
  it('acts on each item in the array', async function () {
    var results = []
    var items = [1, 2, 3, 4]

    await forEach(items, (n) => results.push(-n))
    expect(results).to.eql([-1, -2, -3, -4])
  })

  it('maps an array with promise mapper', async function () {
    var results = []
    var items = [1, 2, 3, 4]

    await forEach(items, (n) => {
      results.push(-n)
      return Promise.resolve()
    })
    expect(results).to.eql([-1, -2, -3, -4])
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

    return forEach(items, function (n) {
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

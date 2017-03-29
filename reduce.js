module.exports = function reduce(array, operator, initial, options) {
  var interval = typeof options == 'object' && options.hasOwnProperty('interval')? options.interval: 10;

  function recurse(index, initial) {
    var startTime = Date.now()
    var accumulator = initial

    for (var a = index, l = array.length; a < l; a++) {
      var item = array[a];
      if (Date.now() - startTime > interval) {
        return new Promise(function (resolve) {
          setImmediate(resolve)
        }).then(function () {
          return recurse(a, accumulator)
        })
      } else {
        var result = operator(accumulator, item, a)

        if (accumulator && typeof accumulator.then === 'function') {
          return accumulator.then(function (result) {
            return recurse(index + 1, result)
          })
        } else {
          accumulator = result
        }
      }
    }

    return Promise.resolve(accumulator)
  }

  return recurse(0, initial)
}

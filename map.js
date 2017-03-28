module.exports = function map(array, map, {interval = 10} = {}) {
  var results = []

  function recurse(startIndex) {
    var startTime = Date.now()

    for (var a = startIndex, l = array.length; a < l; a++) {
      var item = array[a];

      if (Date.now() - startTime > interval) {
        return new Promise((resolve) => {
          setImmediate(resolve)
        }).then(function () {
          return recurse(a)
        })
      }
      
      results.push(map(item, a))
    }

    return Promise.resolve()
  }

  return recurse(0).then(function () {
    return Promise.all(results)
  })
}

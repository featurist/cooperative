var map = require('./map')

module.exports = function(object, mapper) {
  return map(Object.keys(object), function(key) {
    return Promise.resolve(mapper(object[key], key)).then(function (value) {
      return [key, value]
    })
  }).then(function (entries) {
    var result = {}

    entries.forEach(function (entry) {
      result[entry[0]] = entry[1]
    })

    return result
  })
}

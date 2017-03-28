var map = require('./map')

module.exports = function(object, mapper) {
  return map(Object.keys(object), function(key) {
    return Promise.resolve(mapper(object[key], key)).then((value) => {
      return [key, value]
    })
  }).then((entries) => {
    var result = {}

    entries.forEach(([key, value]) => {
      result[key] = value
    })

    return result
  })
}

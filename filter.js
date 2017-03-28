var map = require('./map')

module.exports = function filter(array, predicate, options) {
  return map(array, predicate, options).then(function(predicates) {
    return array.filter((item, index) => predicates[index])
  })
}

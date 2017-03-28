var map = require('./map')

module.exports = function forEach(array, predicate, options) {
  return map(array, predicate, options).then(function() {})
}

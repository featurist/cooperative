# cooperative [![npm version](https://img.shields.io/npm/v/cooperative.svg)](https://www.npmjs.com/package/cooperative) [![npm](https://img.shields.io/npm/dm/cooperative.svg)](https://www.npmjs.com/package/cooperative) [![Build Status](https://travis-ci.org/featurist/cooperative.svg?branch=master)](https://travis-ci.org/featurist/cooperative)

Cooperative threading versions of map, filter, forEach, etc, suitable for big processing in single-threaded Node.js.

One of the gotchas with Node.js is that it's single-threaded. Although the advantages of doing concurrency in a single-threaded environment far outstrip the disadvantages, there are still times when you want to do some lengthy processing but don't want to block up the thread for new HTTP requests or UI activity.

This module provides common functional primitives like `map`, `filter` and `forEach` but that call `setImmediate` regularly so as not to block other activity. This means you can do large processing and stay responsive.

The trick is to call setImmediate regularly so your application is still responsive, but not on every iteration so the processing isn't too slow. This module does that by processing the arrays and calling setImmediate once every 10ms or so, not too much, not too little. This interval is configurable of course.

```js
const cooperative = require('cooperative')

let veryLargeArray = [1, 2, 3, ...]

let resultsPromise = cooperative.map(veryLargeArray, (item, index) => {
  // some involved operation
})

// continue to process other IO, UI events, etc

let results = await resultsPromise
```

# map

```js
let mappedResults = await cooperative.map(array, mapper, options)
```

* array - an array
* mapper(item, index) - a function taking each array `item` and `index`, and returning either a value or a Promise of a value.
* mappedResults - the corresponding results of `mapper` for each `item` in `array`

# filter

```js
let filteredArray = await cooperative.filter(array, predicate, options)
```

* array - an array
* predicate(item, index) - a function taking each array `item` and `index`, and returning either a value or a Promise of a value. If the value is truthy then the item is returned in the 
* filteredArray - the items in `array` for which `predicate` returned a truthy value

# forEach

```js
await cooperative.forEach(array, action, options)
```

* array - an array
* action(item, index) - a function taking each array `item` and `index` and performing an action. If the return value is a promise, then `forEach` will wait for all promises to complete.

# reduce

```js
let reducedResults = await cooperative.reduce(array, operator, initial, options)
```

* array - an array
* operator(accumulator, item, index) - a function taking an `accumulator`, each array `item` and `index`. The return value is the accumulator for the `operator` call on the next `item`.
* initial - the value of the first accumulator
* reducedResults - the last accumulator

# mapObject

```js
let mappedObject = await cooperative.mapObject(object, mapper, options)
```

* object - an object
* mapper(value, key) - a function taking each `value` and `key` in `object`, the value returned is placed into a new object at `key`. This function can return a promise.
* mappedObject - a new object with it's values mapped by `mapper`

# Options

* options.interval - the amount of time in ms to allow processing before calling `setInterval`, defaults to 10ms.

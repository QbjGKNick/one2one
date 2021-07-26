function MyPromise(fn) {
  if (this instanceof MyPromise) {
    throw new TypeError('You must call MyPromise with new')
  }

  if (typeof fn !== 'function') {
    throw new TypeError('MyPromise argument is not function')
  }
}

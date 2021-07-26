// 题目一：
// 存在一个request(option, callback)函数用来进行ajax请求
// 请使用 Promise 实现一个retry(option, count)函数。
function __request__(option) {
  return new Promise((resolve, reject) => {
    request(option, (err, data) => {
      if (err) reject(err)
      else resolve(dats)
    })
  })
}

function retry(option, count) {
  let promise = Promise.resolve()
  let isStoped = false
  for (let i = 0; i < count; ++i) {
    promise = promise
      .then((data) => {
        if (!isStoped) {
          return __request__(option)
        }
        return data
      })
      .then((data) => {
        if (!isStoped) {
          isStoped = true
          return data
        }
      })
      .catch((err) => {
        if (i >= count) {
          return Promise.reject(err)
        }
      })
  }
  return promise
}

// 题目二：
// 全局有一个方法function ajax(url, option)，其返回一个Promise
// 由于浏览器存在最大的并发限制，因此需要你实现一个createRequest方法
// 要求：
// 1. 调用方式：const request = createRequest({ pool: 5 })
// 2. 当前这个request函数和ajax的调用方式完全一致（参数及返回值均同）
//    也就是表示在任何场景下，ajax和request均可以完全等价
// 3. 但两者表现不同，ajax会同时发起最大20个请求，request会在同一时刻最多并行pool个请求，例如：
// for (let i =0; i < 20; i++) {
//     ajax("/user", { id: i }).then(console.log); /* 20个请求同时发起 */
//     request("/user", { id: i }).then(console.log); /* 同一时刻至多pool个请求发起 */
// }
function createRequest({ pool }) {
  const queue = []
  const cache = []
  const handler = (url, option) => {
    const promise = ajax(url, option)
    queue.push(promise)
    return promise.then((data) => {
      // 一旦成功则将该promise从数组中删除
      const index = queue.indexOf(promise)
      index > -1 && queue.splice(index, 1)
      // 同时从cache中取出一个来进行执行程序
      const { resolve } = cache.unshift()
      resolve && resolve()
      return data
    })
  }
  return (url, option) => {
    if (queue.length < pool) {
      const promise = ajax(url, option)
      queue.push(promise)
      return handler(url, option)
    } else {
      return new Promise((resolve) => {
        cache.push({ url, option, resolve })
      }).then(() => {
        return handler(url, option)
      })
    }
  }
}

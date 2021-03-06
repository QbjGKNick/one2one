// 存在一个request(option, callback)函数用来进行ajax请求, 请实现一个retry(option, callback, count)函数。

function retry(option, callback, count) {
  request(option, (error, data) => {
    if (error != null) {
      if (count <= 0) {
        callback(error)
      } else else {
        retry(option, callback, count -1)
      }
    } else {
      callback(null, data)
    }
  })
}

// callbakc -> callback hell
// promise -> 共享变量无法很好的进行.then链式传递
let extra = {}
Promise.resolve().then((data) => {
  extra.num = 1
  return Promise.resolve(data)
}).then(data => {
  
}).then(() => {

}).then(() => {

})
// async/await -> 具有传染性
try {
    let extra = {}
    data = await async1()
    extra.num = 1
    await async2(data, extra)
    await async3(data, extra)
} catch(e) {

}

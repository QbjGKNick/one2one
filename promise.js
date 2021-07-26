Promise.resolve()
  .then(() => {
    console.log(0)
    // 按照新的规范来说，当你then后面去返回一个Promise的时候
    // 那么它会为我们包装一个Thenable
    // new Promise(resolve => Promise.resolve(4).then(resolve))
    return Promise.resolve(4)
  })
  .then((res) => {
    console.log(res)
  })

Promise.resolve()
  .then(() => {
    console.log(1)
  })
  .then(() => {
    console.log(2)
  })
  .then(() => {
    console.log(3)
  })
  .then(() => {
    console.log(5)
  })
  .then(() => {
    console.log(6)
  })
// 打印结果 0 1 2 3 4 5 6

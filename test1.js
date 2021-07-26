// // 第1题
// this.name = 'global'
// function Parent(name) {
//   this.name = name
//   this.sayMyName = function () {
//     console.log(this.name)
//   }
// }
// Parent.prototype.jump = () => {
//   console.log(`${this.name} jump`)
// }
// function Child(name, age) {
//   Parent.call(this, name)
//   this.age = age
//   this.sayMyAge = () => {
//     console.log(this.age)
//   }
// }
// const Func = function () {}
// Func.prototype = Parent.prototype
// Child.prototype = new Func()
// Child.prototype.constructor = Child
// const child = new Child('Eros', 18)
// child.sayMyAge() // 18
// child.sayMyName() // Eros
// child.jump() // global jump

// // 第2题
// const obj = (function () {
//   return {
//     a: 1,
//     b: 2,
//     c: () => {
//       return this.a
//     },
//     d: function () {
//       return this.b
//     }
//   }
// })()
// console.log(obj.a) // 1
// console.log(obj.c()) // undefined
// console.log(obj.d()) // 2
// const c = obj.c
// const d = obj.d
// console.log(c()) // undefined
// console.log(d()) // undefined

// // 第3题
// const promise1 = new Promise((resolve) => {
//   console.log(1)
//   setTimeout(() => resolve(2), 0)
// })
// const promise2 = Promise.resolve(3)
// promise1.then((v) => console.log(v))
// promise2.then((v) => console.log(v))
// async function asyncHandler() {
//   return new Promise((resolve) => {
//     console.log(4)
//     setTimeout(() => resolve(5), 0)
//   })
// }
// ;(async () => {
//   console.log(await asyncHandler())
// })()
// // 1 4 3 2 5

// // 第4题
// // 请实现一个inherbit函数，其作用为进行原型继承，并讨论你所写的实现的优缺点。
// function inherbit(Child, Parent) {
//   // 原型继承方案1：
//   Child.prototype = new Parent()
//   Child.prototype.constructor = Child

//   // 寄生组合式继承
//   Child.prototype = Object.create(Parent.prototype)
//   Child.prototype.constructor = Child
// }
// function Animal() {}
// function Dog() {}
// inherbit(Dog, Animal)

// 第5题
// 现需要使用Promise完成红绿灯的逻辑（请通过如下测试示例）：
// red/green/yellow函数// 请勿修改，仅能直接使用
function red() {
  console.log('red...')
}
function green() {
  console.log('green...')
}
function yellow() {
  console.log('yellow...')
}

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

function startLoopLight(arr) {
  let promise = Promise.resolve()
  for(let i = 0; i < arr.length; i++) {
    promise = promise.then(() => {
      return arr[i][0]()
    }).then(() => {
      return wait(arr[i][1])
    })
  }

  return promise.then(() => {
    return startLoopLight()
  })
}
// 循环输出
// red
// wait(1000ms)
// green
// wait(2000ms)
// yellow
// wait(3000ms)
// red
// wait(1000ms)
// .....
startLoopLight([
  [red, 1000],
  [green, 2000],
  [yellow, 3000]
])

// 第6题
// 请手写一个简单的Promise实现，其需要包含Promise构造函数和then方法。
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
function Promise(callback) {
  const self = this
  self.state = PENDING
  self.value = null
  self.resolvedCallbacks = []
  self.rejectedCallbacks = []

  function resolve(value) {
    if (self.state === PENDING) {
      self.state = RESOLVED
      self.value = value
      self.resolvedCallbacks.map((cb) => cb(self.value))
    }
  }

  function reject(value) {
    if (self.state === PENDING) {
      self.state = REJECTED
      self.value = value
      self.rejectedCallbacks.map((cb) => cb(self.value))
    }
  }

  try {
    callback(resolve, reject)
  } catch (error) {
    reject(error)
  }
}
Promise.prototype.then = function (onfulfilled, onrejected) {
  const self = this
  onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : (v) => v
  onRejected =
    typeof onrejected === 'function'
      ? onrejected
      : (e) => {
          throw e
        }
  if (self.state === PENDING) {
    self.resolvedCallbacks.push(onfulfilled)
    self.rejectedCallbacks.push(onrejected)
  }
  if (self.state === RESOLVED) {
    onfulfilled(self.value)
  }
  if (self.state === REJECTED) {
    onrejected(self.value)
  }
}

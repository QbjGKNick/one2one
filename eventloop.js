// 1.事件循环 --> requestAnimationFrame
// 2.Task Queue --> []
// 3.JS Engine

let TaskQueue=[]
function EventLoop() {
    const now = Date.now()
    for (let i=0;i<TaskQueue.length;i++) {
        const {startTime, delay, handler} = TaskQueue[i]
        if (now-startTime>=delay) {
            handler()
            TaskQueue[i] = null
        }
    }
    TaskQueue = TaskQueue.filter(v => !!v)
    requestAnimationFrame(EventLoop)
}

EventLoop()

function mySetTimeout(handler, delay) {
    delay = delay == null ? 0 : delay
    TaskQueue.push({ handler, startTime: Date.now(), delay})
}

mySetTimeout(function () {
    console.log('Hello world!');
}, 1000)
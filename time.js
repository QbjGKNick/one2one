setTimeout(function () {
    console.log(1);
}, 1)

new Promise(function(a, b) {
    console.log(2);
    for (var i = 0; i < 10; i++) {
        i == 9 && a();
    }
    console.log(3);
}).then(function () {
    console.log(4);
})

console.log(5);
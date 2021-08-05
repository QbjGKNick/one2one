// 执行以下代码
// console.log 各自会打印什么信息
const data = {
  valueOf: () => 123,
  toString: () => 'abc',
}
  
console.log(data == 123); // true
console.log(data === 123); // false
console.log(`${data}` === 'abc'); // true
console.log(data + '' === 'abc'); // false

/**
 * 类型转换
 * 知识点1 == 运算符比较
 *   1. 两侧数据类型一致
 *   2. 两侧数据类型不一致
 *      - null == undefined => true
 *      - 字符串 == 对象 => 要把对象转为字符串
 *      - 两边数据类型不一致，需要将其转换为数字再比较
 * 
 * 知识点2 对象转数字
 *   先toString转换为字符串（先基于valueOf获取原始值，没有原始值再去调用toString），
 *   最后再转换为数字
 * 
 * 知识点3 对象做数学运算
 *   底层原理：首先检测对象的Symbol.toPrimitive属性值，如果有则取这个值，
 *        如果没有则检测对象的ValueOf()这个值【原始值：基本类型值】，如果有这个值，则取它，
 *        如果也没有则获取对象的toString()把其变成字符串
 *  
 */ 
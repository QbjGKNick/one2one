// TOKEN 规则：
// ID -> [a-zA-Z](a-zA-Z0-9)* -> name/name1/id1/id234/ididi456
// NUM -> [1-9](0-9)* -> 10/1/199
// LEFTBRACE -> [
// RIGHTBRACE -> ]
// SEMI -> .

// Parser规则：
// INDEXEXPRESSION -> (MEMBEREXPRESSION | ID) LEFTBRACE ID RIGHTBRACE
// MEMBEREXPRESSION -> (INDEXEXPRESSION | ID) SEMI ID

// AST
// 用途：在编译工具里，编译工具需要依赖AST这个数据结构进行相关的代码转换
// 特点：AST的上节点存储操作（例如+、-、*、/以及[]....），左右节点存放表达式/ID
// TypeScript编译器、Babel、Webpack（资源定位、Tree Shaking）

const tokenizer = {
  path: '',
  next() {}
}

const parser = {
  parse() {}
}

const _ = {
  get(target, keypath) {}
}

_.get({ a: [{ b: { c: 1 } }] }, 'a[0].b[0].c')
// a[0].b.c().d
// a['name'].b.c().d
// token + parser + transform + 解析的工作

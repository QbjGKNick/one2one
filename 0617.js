// TOKEN 规则：
// ID -> [a-zA-Z][a-zA-Z0-9]* -> name/name1/id1/id234/ididi456
// NUM -> [0-9][0-9]* -> 10/1/199
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
const TOKEN_TYPE = {
  ID: 0,
  NUM: 1,
  LEFTBRACE: 2,
  RIGHTBRACE: 3,
  SEMI: 4
}

const tokenizer = {
  path: '',
  index: 0,
  pathLength: 0,
  init(path) {
    this.path = path
    this.pathLength = path.length
    this.index = 0
  },
  next() {
    let token = ''
    let skipped = this.skipBlank()
    if (!skipped) {
      return null
    }

    while (true) {
      if (this.index > this.pathLength) {
        break
      }

      const char = this.path[this.index]
      if (this.isBlank(char)) {
        break
      }

      if (this.isCharOrNumber(char)) {
        token += char
        this.index += 1
      } else if (this.isMark(char) && token.length === 0) {
        token = char
        this.index += 1
        break
      } else {
        break
      }
    }

    if (/[a-zA-Z][a-zA-Z0-9]*/.test(token)) {
      return [TOKEN_TYPE.ID, token]
    } else if (/[0-9][0-9]*/.test(token)) {
      return [TOKEN_TYPE.NUM, token]
    } else if (token === '[') {
      return [TOKEN_TYPE.LEFTBRACE, token]
    } else if (token === ']') {
      return [TOKEN_TYPE.RIGHTBRACE, token]
    } else if (token === '.') {
      return [TOKEN_TYPE.SEMI, token]
    }
  },
  skipBlank() {
    while (true) {
      if (this.index > this.pathLength) {
        return false
      }

      const char = this.path[this.index]
      if (this.isBlank(char)) {
        this.index += 1
      } else {
        break
      }
    }

    return true
  },
  isBlank(char) {
    return (
      char === ' ' ||
      char === '\n' ||
      char === '\t' ||
      char === '\n' ||
      char == null
    )
  },
  isCharOrNumber(char) {
    return /[a-zA-Z0-9]/.test(char)
  },
  isMark(char) {
    return char === '[' || char === ']' || char === '.'
  }
}

const parser = {
  parse() {}
}

const _ = {
  get(target, keypath) {
    tokenizer.init(keypath)

    // LL1
  },
  // ID LEFTBARCE NUM RIGHTBRACE
  indexExpression() {
    const memberExpression = this.memberExpression()
    if (memberExpression == null) {
      const id = this.getToken()
    }
    const leftBrace = this.getToken()
    if (id[0] === TOKEN_TYPE.ID && leftBrace[0] === TOKEN_TYPE.LEFTBRACE) {
      // 我们就认为它是一个indexExpression
      const num = this.getToken()
      const rightBrace = this.getToken()
      return {
        type: 'IndexExpression',
        id: id[1],
        num: num[1]
      }
    }
  },
  // ID SEMI ID
  memberExpression() {
    const id = this.getToken()
    const semi = this.getToken()
    if (id[0] === TOKEN_TYPE.ID && semi[0] === TOKEN_TYPE.SEMI) {
      const right = this.getToken()
      return {
        type: 'MemberExpression',
        id: id[1],
        right: right[1]
      }
    }
  },
  getToken() {
    return tokenizer.next()
  }
}

// _.get({ a: [{ b: { c: 1 } }] }, 'abcd01[1000]')
_.get({ a: [{ b: { c: 1 } }] }, 'a[0].b[0].c')
// a[0].b.c().d
// a['name'].b.c().d
// token + parser + transform + 解析的工作

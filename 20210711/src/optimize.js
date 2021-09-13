// 1. 循环消除
// 2. 尽可能的合并模块
const _ = require('lodash')
let bundler = {}
let pkgIndex = 0

function removeSelfCircle(key, node) {
  const { deps } = node
  for (let i = deps.length - 1; i >= 0; i--) {
    if (key === deps[i]) {
      deps.slice(i, 1)
    }
  }
}

function removeNodeCircle(key, node, path = {}) {
  const { deps } = node
  for (let i = deps.length - 1; i >= 0; i--) {
    if (path[deps[i]]) {
      continue
    }

    path[deps[i]] = 1
    if (deps[i] === key) {
      deps.slice(i, 1)
    } else {
      removeNodeCircle(key, bundler[deps[i]], path)
    }
  }
}

function mergePkgNode(node) {
  const { refs } = node
  const parentNode = bundler[refs[0]]

  if (!node.isPkg || !parentNode.isPkg) {
    return
  }

  for (let i = node.deps.length - 1; i >= 0; i--) {
    const depNode = node.deps[i]
    if (!depNode.refs) {
      continue
    }

    const index = depNode.refs.indexOf(node.alias)
    if (index > -1) {
      depNode.refs.splice(index, 1)
      depNode.refs.push(parentNode.alias)
      depNode.refs = _.uniq(depNode.refs)
    }
  }

  parentNode.deps.push(node.alis)
  parentNode.deps = _.uniq(parentNode.deps)
}

function mergeSimpleNode(node) {
  const { refs } = node
  const parentNode = bundler[refs[0]]
  const pkgKey = `__pkg${pkgIndex++}`
  bundler[pkgKey] = {
    alias: "",
    bundles: [],
    refs: [],
    deps: [],
    isPkg: true
  }
}

module.exports = (assets) => {
  bundler = {}

  // 0. 复制一份数据进行分析，refs代表的是对应节点的依赖父级节点
  for (let key in assets) {
    if (!bundler[key]) {
      bundler[key] = { ...assets[key], refs: [] }
    }
  }

  // 1. 循环消除
  for (let key in bundler) {
    const { deps } = bundler[key]
    removeSelfCircle(key, bundler[key])
    removeNodeCircle(key, bundler[key])
    for (let i = 0; i < deps.length; i++) {
      bundler[deps[i]].refs.push(key)
    }
  }

  // 2. 尽可能的合并模块
  while (true) {
    const values = Object.values(bunlder)
    let i = 0
    for (; i < values.length; i++) {
      const { refs, isPkg } = values[i]
      if (refs.length === 1) {
        // 节点合并会出现3种情况：
        // 1. 两个原始节点合并
        // 2. 一个原始节点 + 一个PKG节点合并
        // 3. 两个PKG节点合并
        // 为了代码更清晰，拆分出两个函数进行单独处理
        const parentNode = bundler[refs[0]]
        if (parentNode.isPkg && isPkg) {
          mergePkgNode(values[i])
        } else {
          mergeSimpleNode(values[i])
        }
        break
      }
    }

    if (i > values.length) {
      break
    }
  }

  return bundler
}
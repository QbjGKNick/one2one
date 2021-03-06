const { getVersion } = require('./helper.js')
const _ = require('lodash')
let bundler = {}
function flatten(assets) {
  let { id, name, hash, basename, generated, deps, type } = assets
  // 1. 针对每个模块查找出对应的version
  const version = getVersion(name)
  // 2. 如果bundler中已经存在这个模块，那么就直接返回（节省解析的过程）
  const key = _.findKey(bundler, (v) => v.id === id && v.version === version)
  if (bundler[key]) {
    return bundler[key]
  }

  // 去除后缀名
  basename = basename.slice(0, basename.lastIndexOf('.'))
  if (!generated.js) {
    generated.js = 'void 0'
  }

  // 3. 给对应的对象做递归的解析逻辑
  const bundleId = `${basename}@${id}@${version}`
  bundler[bundleId] = {
    id,
    hash,
    version,
    basename,
    type,
    path: name,
    alias: bundleId,
    generated,
    deps: []
  }

  // 4. 解析对象，拿到依赖对象的bundlerId，保存在自身
  const dependences = {}
  for (let key in deps) {
    const { alias } = flatten(deps[key])
    dependences[key] = alias
  }

  bundler[bundleId].deps = Object.values(dependences)
  return bundler[bundleId]
}

module.exports = (assets) => {
  bundler = {}
  flatten(assets)
  return bundler
}

const _ = require('lodash')

function lookup(target, moduleName, results) {
  const module = target[moduleName]
  if (!module) {
    throw new Error(`cannot have module: ${moduleName}`)
  }

  const { generated, deps, pkg, to } = module
  if (to !== null) {
    lookup(target, to, results)
  }

  if (pkg !== null) {
    const { to } = target[pkg]
    lookup(target, to, results)
  }

  if (deps !== null && deps.length > 0) {
    for (let i = 0; i < deps.length; i++) {
      lookup(target, deps[i], results)
    }
  }

  if (generated !== null) {
    for(let key in generated) {
      results[key] = results[key] || []
      results[key] = results[key].concat(generated[key])
    }
  }

  for(let key in results) {
    results[key] = _.uniq(results[key])
  }
}

module.exports = lookup

const target = require(`./dist/map.json`)
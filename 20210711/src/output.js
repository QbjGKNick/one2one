const fs = require('fs')
const md5 = require('md5')
let bundler = {}

function write2file(asset) {

}

function output2pkg(assets, asset) {
  const { bundles, alias } = asset
  const generated = {}

  if (bundler[alias]) {
    return
  }

  bundler[alias] = 1
  for (let i = 0; i < bundles.length; i++) {
    const item = assets[bundles[i]]
    for (let key in item.generated) {
      if (!generated[key]) {
        generated[key] = []
      }
      generated[key].push(item.generated[key])
    }

    assets[bundles[i]].path = null
    assets[bundles[i]].generated = null
    delete assets[bundles[i]].path
    delete assets[bundles[i]].generated
  }

  for (let key in generated) {
    generated[key] = generated[key].join('\n')
  }

  asset.generated = generated
  asset.hash = md5(Object.values(generated).join(''))
  asset.alias = `${alias}@${asset.hash}`
  asset.path = null
  asset.type = 'pkg'
  asset.version = null

  asset.bundles = null
  delete asset.bundles

  assets[asset.alias] = assets[alias]
  assets[alias] = {
    alias,
    to: asset.alias
  }

  write2file(asset)
}

function output2file(asset) { }

module.exports = (assets, dirpath) => {
  bunlder = {}

  for (let key in assets) {
    const asset = assets[key]
    if (asset.isPkg) {
      continue
    }
    console.log(assets);
    if (asset.pkg) {
      output2pkg(assets, assets[asset.pkg])
    } else {
      output2file(asset)
    }
  }

  fs.writeFileSync(`${dirpath}/map.json`, JSON.stringify(assets))

  // 输出lookup/module 等相关依赖文件
  for (let key of ['package.json', 'index.html', 'lookup.js', 'module.js']) {
    let data = fs.readFileSync(`${__dirname}/../vendor/${key}`)
    fs.writeFileSync(`${dirpath}/${key}`, data)
  }
}
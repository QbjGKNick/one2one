const md5 = require('md5')
const bundlers = {}
function conv2Json(asset) {
  const { name, depAssets, type, hash, generated, basename } = asset
  const ref = {}
  ref.id = md5(name).slice(0, 7)
  ref.name = name
  ref.type = type
  ref.basename = basename
  ref.hash = hash
  ref.generated = generated
  ref.deps = {}
  if (!bundlers[name]) {
    bundlers[name] = ref
  }

  for (const [key, value] of depAssets) {
    const { name } = value
    if (bunlders[name]) {
      ref.deps[key.name] = bundlers[name]
    } else {
      ref.deps[key.name] = conv2Json(value)
    }
  }

  return ref
}

module.exports = (assets) => {
  const { entryAsset } = assets
}

const fs = require('fs')
const path = require('path')
module.exports = {
  getVersion(filepath) {
    while (filepath.length) {
      const lastIndex = filepath.lastIndexOf(path.sep)
      if (lastIndex === -1) {
        return '1.0.0'
      }

      filepath = filepath.slice(0, lastIndex)
      const pkg = `${filepath}${path.sep}package.json`
      if (fs.existsSync(pkg)) {
        const json = require(pkg)
        return json.version || '1.0.0'
      }
    }
  }
}
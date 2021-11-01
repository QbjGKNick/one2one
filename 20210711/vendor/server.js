const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const lookup = require('./lookup')
const target = require('./map.json')

// http://localhost/combo??dist/js/__pkg0.js,dist/js/__pkg1.js,dist/css/normalize.js
app.get('/combo', (req, res) => {
  console.log(req);
  const { url } = req
  const index = url.indexOf('??')
  let contentType = null
  if (index > -1) {
    let temp = url.slice(index + 2)
    temp = temp.split(',')
    for(let i=0;i<temp.length;i++) {
      // const filepath = temp[i]
      const filepath = `../${temp[i]}`
      const index = filepath.lastIndexOf('.')
      if (index === -1) {
        continue
      }

      const ext = filepath.slice(index + 1)
      if (ext === 'js') {
        contentType = 'application/javascript'
      } else if (ext === 'css') {
        contentType = 'text/css'
      }
      if (fs.existsSync(filepath)) {
        temp[i] = fs.readFileSync(filepath).toString()
      } else {
        temp[i] = ''
      }
    }
    res.send(temp.join('\n'))
  } else {
    res.send('')
  }
})

app.get('/', (req, res) => {
  // 在真实项目中，我们会通过页面id + 数据库检索的方式拿到入口的标识
  const entry = 'PageA@d56bca4@1.0.0'
  const assets = lookup(target, entry)
  const htmlstr = fs.readFileSync('./index.html').toString()
  let { js, css } = assets
  js = `/combo??${js.join(',')}`
  css = `/combo??${css.join(',')}`
  htmlstr = htmlstr.replace('<!-- LAIS CSS INSERT HERE -->', `<link rel="stylesheet" href="${css}"></link>`)
  htmlstr = htmlstr.replace('<!-- LAIS JS INSERT HERE -->', `<script src="${js}"></script>`)
  
  res.set('Content-Type', 'text/html')
  res.send(htmlstr)
})

app.listen(3000, () => {
  console.log('Server listening @ 3000...');
})
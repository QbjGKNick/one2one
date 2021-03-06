const program = require('commander')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const Bundler = require('parcel-bundler')
const transform = require('./src/transform.js')
const flatten = require('./src/flatten.js')
const optimize = require('./src/optimize.js')
const output = require('./src/output.js')
const walker = require('folder-walker')
const isdir = require('isdir')
const _ = require('lodash')

program.version(require('./package.json').version)
program.option('-d, --dir <dirpath>', 'set the output directory, default to .')
program
  .command('build       [options]')
  .description('build for production')
  .action(async (env, options) => {
    const { args, dir } = options.parent
    if (args.length === 0) {
      console.error(
        chalk.red(`[Error] >>> missing build dirpath: lais build [dirpath]`)
      )
      process.exit(1)
    }
    console.log(chalk.green(`[INFO] >>> build start ...`))
    // console.log(options)
    // lais build ./demo -d ./output
    // 0. 去获取到所有的项目下的pages的*.vue文件
    let dirpath = path.resolve('.', args[0])
    dirpath = `${dirpath}${path.sep}pages`
    const dirs = fs.readdirSync(dirpath)
    let files = []
    for (let i = 0; i < dirs.length; i++) {
      const filepath = `${dirpath}${path.sep}${dirs[i]}`
      if (!isdir(filepath)) {
        files.push(filepath)
      }
    }

    for (let i = 0; i < files.length; i++) {
      const bundler = new Bundler(files[i], {
        target: 'browser', // 编译的目标
        bundleNodeModules: true,
        watch: false,
        hmr: false,
        minify: true,
        cache: true,
        sourceMaps: false,
        autoinstall: false,
        contentHash: true
      })
  
      let assets = await bundler.bundle()
      // 1. 将assets的对象转化为JSON的形式方便我们进行调试和查看
      assets = transform(assets)
      // 2. 将嵌套的资源JSON对象进行展平操作（为了方便开发和调试）
      files[i] = flatten(assets, dir)
    }

    const temp = {}
    let asset = _.unionBy(...files.map(v => Object.values(v)), 'alias')
    for (let i = 0; i < asset.length; i++) {
      temp[asset[i].alias] = asset[i]
    }

    // 3. 资源表的优化（合并/循环消除）
    asset = temp
    asset = optimize(asset)
    output(asset)
  })

program
  .command('dev         [options]')
  .description('starts the bundler in watch node')
  .action((env, options) => {
    console.log(chalk.red('dev start...'))
  })

program
  .command('project     [options]')
  .description('create new project')
  .action((env, options) => {
    const { args, dir } = options.parent
    if (args.length === 0) {
      console.error(
        chalk.red(`[Error] missing project name: lais project [name]`)
      )
      process.exit(1)
    }
    const dirpath = path.resolve(dir || '.') + '/' + args[0]
    if (fs.existsSync(dirpath)) {
      return
    }

    fs.mkdirSync(dirpath)
    ;[
      'package.json',
      'index.js',
      'index.html',
      'App.vue',
      '.babelrc',
      '.gitignore'
    ].forEach((v) => {
      const src = __dirname + `/template/${v}`
      if (fs.existsSync(src)) {
        let content = fs.readFileSync(src).toString()
        content = content.replace(/{{name}}/g, args[0])
        fs.writeFileSync(`${dirpath}/${v}`, content)
      }
    })
    ;['assets', 'pages'].forEach((v) => {
      fs.mkdirSync(`${dirpath}/${v}`)
    })

    console.log(
      chalk.green(`[INFO] >>> create ${args[0]} project successfully`)
    )
  })

program
  .command('page        [options]')
  .description('create new page')
  .action((env, options) => {
    const { args, dir } = options.parent
    if (args.length === 0) {
      console.error(
        chalk.red(`[ERROR] >>> missing page name: lais page [name]`)
      )
      process.exit(1)
    }

    const dirpath = path.resolve(dir || '.') + '/pages'
    console.log(dirpath)
    if (!fs.existsSync(dirpath)) {
      console.error(chalk.red(`[ERROR] >>> ${dirpath} not exists`))
      process.exit(1)
    }

    let data = fs.readFileSync(__dirname + '/template/pages/Template.vue')
    const distName = `${dirpath}/${args[0]}.vue`
    fs.writeFileSync(distName, data)
    console.log(chalk.green(`[INFO] >>> create ${args[0]} page successfully`))
  })

program.parse(process.argv)

// lais project your project
// 动态加载的问题
// A和B分别在两个项目中进行开发，但是其运行是在一个项目中运行
// 1. A和B他们都共同拥有一些公共库，但是公共库的版本不尽相同，比如A依赖于 vue 2.11而B依赖于Vue 2.9
// 2. 由于A和B是动态加载的方式，因此他们的代码并不能完全的打包为bundle -> 需要按需加载

// a.bundle.js + b.bundle.js
// Entry.html -> A component1 + B component2

// 静态分析（目前所有未被改造的编译工具所采用）
//    a = require("./xxxx")
//    import a from "...."
//    好处：简单、性能上好
// 动态分析（我们根据依赖的依据在运行时进行分析，然后加载）
// loader

// 针对于我们当前的需求，静态分析不能够满足，因此我们采用动态分析的方式进行处理
// -> 资源表
// -> webpack: stats.json
// -> parcel: bundle（优先用parcel来进行讲解）

// 1. -> 解析map.json的库
//    -> PageA@d56bca4@1.0.0 -> [__pkg0, __pkg1, normalize]

// 2. -> combo -> http://localhost??__pkg0,__pkg1,normalize --> 返回的是逗号分隔的文件合并内容
// 为什么用combo? 为了减少加载的请求（http2的话，就没必要这么做了）

// 3. -> AMD最小实现 -> 实现define及require方法

// 4. -> 编写入口index.html, 将整个项目能够顺利渲染出来

// 5. -> CI/CD/部署（GitHub Actions/Jenkins/CDN）

// 6. -> SSR部分（基于Vue-SSR来自己搭建一个项目进行渲染）
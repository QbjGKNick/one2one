const program = require('commander')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const Bundler = require('parcel-bundler')
const transform = require('./src/transform.js')
const flatten = require('./src/flatten.js')

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
    // console.log(dir)
    // console.log(chalk.green(`[INFO] >>> build start ${dir}...`))
    // lais build ./dem -d ./output
    const dirpath = path.resolve('.', args[0])
    // console.log(dirpath)
    const bundler = new Bundler(`${dirpath}/index.html`, {
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
    console.log(assets)
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
// 动态分析（我们根据依赖的依据在运行时进行分析，然后加载）
// loader

// 针对于我们当前的需求，静态分析不能够满足，因此我们采用动态分析的方式进行处理
// -> 资源表
// -> webpack: stats.json
// -> parcel: bundle（优先用parcel来进行讲解）

## 脚手架及编译工具补充课：
1. 如何编写脚手架
2. 如何基于依赖分别编写自己的编译工具 -- Parcel/Webpack -> 依赖关系表 -> 如何转换为资源表
3. 如何使用program/chalk等实现命令行工具
4. 如何综合以上实现一个生产级别的项目实践 -> lais -> La Integered System
* lais project [name]
* lais page [name]
* lais build
* lais dev

tree shake/依赖分析/Module Federation（资源表动态加载）

## 问题：如何进行按需加载Vue组件进行页面渲染
* 在我们常规的项目开发中，如果不进行[手动]的动态import，那么编译工具将会为我们产出一个bundle.js
* 但在性能优化、需要按照组件细粒度加载等情况下，不能够直接使用bundle.js
* 我们希望得到的是：页面可以根据后端的数据进行动态分析，然后加载必要的组件js及css
* 微前端
* Webpack Module Federation(模块联邦)

// 团队A、B -> Page A
// 团队A、B的仓库是独立的，代码的部署也是分开的
// A、B -> 依赖Vue(同一个版本)、Lodash(同一个版本)
// A-> A1，A2，A3..., B -> B1，B2，B3...
// Page A -> A1, A2, B1, B2
// 加载的时候仅加载出-> A1 + A2 + B1 + B2 + Vue + Lodash (并且是合并包) ---> 如何解决这个问题（Module Federation）
// 如果我们直接使用WebPack:
// A1\A2\A3\Vue\Lodash -> bundle1.js
// B1\B2\B3\Vue\Lodash -> bundle2.js
// -> bundle1.js + bundle2.js (额外加载了：A3\B3\Vue\Lodash)


# 常用目录结构:
// ---> bin  (存放你的工具启动入口)
// ---> src
// ---> template (脚手架的模板代码)
// ---> .balbelrc
// ---> index.js
// ---> package.json

# 问：如何让我们的项目发布到npm后全局安装能够直接进行命令行的调用
// 答：配置package.json里的bin及name字段

# 问：bin文件的标准写法是什么
// #!/usr/bin/env node
// require("../index.js");

# 编写命令行工具常用的两个库：commander/chalk
// commander/chalk的使用 -> 详细请看官方的文档

// 如何去创建一个项目的脚手架 ---> 约定项目的模板！

# 一个标准的Vue项目模板
// ---> assets (存放公共库或者图片内容)
// ---> pages (存放项目的页面)
// ---> .babelrc
// ---> App.vue (项目入口)
// ---> index.html (标准的html代码)
// ---> index.js
// ---> package.json

# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.


# Project setup
```
asdf install
pnpm install
```

## Compiles and hot-reloads for development
```
pnpm start
```

## Compiles and minifies for production
```
pnpm build
```

## Lints and fixes files
```
pnpm lint
pnpm lint:ts
pnpm lint:style
```

## Customize configuration
See [Configuration Reference](https://cn.vitejs.dev/guide/).


## Directory Introduction

```
.
├── script                   # node自动化部署相关脚本
├── src                      # 项目主要工程文件夹
│  ├── components            # 公共组件
│  │  └── common             # 基础组件，区别于具体业务组件
│  ├── constants             # 常量
│  ├── views                 # 页面
│  ├── assets                # 存放应用引用静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
│  ├── stores                # 状态管理器，可存放公共数据
│  ├── router                # router 路由配置
│  ├── styles                # 公共样式和mixins样式
│  ├── utils                 # 工具方法
│  ├── app.vue               # 应用配置，用来配置App全局样式以及监听
│  ├── main.js               # Vue初始化入口文件
├── .env                     # 开发环境变量
├── .env.production          # 正式环境变量
├── .env.staging             # 测试环境变量
├── .eslintignore            # 代码检测忽略文件配置
├── .eslintrc.cjs             # 代码检测规则配置
├── .gitignore               # git忽略文件配置
├── .gitlab-ci.yml           # ci配置
├── package.json             # 依赖包配置
├── postcss.config.cjs        # postcss配置
└── vite.config.js            # vite 拓展配置
```

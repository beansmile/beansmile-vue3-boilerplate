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
│  ├── hooks                 # 用于抽离公共页面和store的方法数据，有别于utils 和 store，hooks 跟页面业务逻辑相关
│  ├── views                 # 页面
│  ├── assets                # 存放应用引用静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
│  ├── stores                # 状态管理器，可存放公共数据
│  ├── router                # router 路由配置
│  ├── styles                # 公共样式和mixins样式
│  ├── utils                 # 工具方法
│  ├── app.vue               # 应用配置，用来配置App全局样式以及监听
│  ├── main.ts               # Vue初始化入口文件
├── .env                     # 开发环境变量
├── .env.production          # 正式环境变量
├── .env.staging             # 测试环境变量
├── .eslintignore            # 代码检测忽略文件配置
├── .eslintrc.cjs            # 代码检测规则配置
├── .gitignore               # git忽略文件配置
├── .gitlab-ci.yml           # ci配置
├── package.json             # 依赖包配置
├── postcss.config.cjs       # postcss配置
└── vite.config.ts           # vite 拓展配置
```

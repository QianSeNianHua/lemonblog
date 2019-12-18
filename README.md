# hackernews-async-ts

[Hacker News](https://news.ycombinator.com/) showcase using typescript && egg

## QuickStart

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+

### 目录结构
app
  ├── controller (前端的请求会到这里来
  │
  ├── model (数据库表结构抽象出来的模型)
  │
  ├── service (controller层不建议承载过多的业务，业务重时放在service层)
  │
  ├── public (静态文件)
  │
  ├── router.ts (Url的相关映射)


### 安装egg-init注意
不要使用egg-init {项目名称}
应该使用egg-init --type={类型，例如ts, simple等} {项目名称}


### vscode正确使用egg方式
* npm全局安装egg-init
* 安装插件tslint
* 安装插件eggjs


* [路由去中心化](https://blog.csdn.net/weixin_30535167/article/details/99399220)



https://zhuanlan.zhihu.com/p/33766385

https://github.com/Foveluy/egg-blueprint

看看这个
https://blog.csdn.net/sinat_17775997/article/details/88026476


后端快速开发框架：
https://cool-admin.com/

不靠谱的Egg.js(茶叶蛋，ts-egg被叫成tea egg)
https://claude-ray.github.io/2019/09/17/egg-framework-dev/
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
  ├── controller (前端的请求会到这里来)
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


### 插件教程
[egg-validator](https://www.cnblogs.com/hengyumo/p/11134619.html)



### ubuntu安装docker，部署Nginx，eggjs，mysql，redis



[在Docker中部署Egg.js应用及Docker常用命令](https://www.jianshu.com/p/8cd7ba8bc3d5)


docker启动mysql
1、将ubuntu服务器上的sql文件拷贝到docker中
docker cp blog.sql mysqla:/blog.sql
第一个是ubuntu服务器上的sql文件位置
第二个是要拷贝到容器中的位置
2、docker pull mysql
3、-e 配置信息，是mysql的root用户的登录密码
docker run -p 3306:3306 --name mysqla -e MYSQL_ROOT_PASSWORD=root -d mysql
4、进入容器
docker exec -it mysqla /bin/bash
5、登录mysql
mysql -uroot -proot
6、新建数据库
create database blog;
7、设置配置，因为直接导入，存储过程、函数、触发器都会报错
SET GLOBAL log_bin_trust_function_creators = 1;
8、选择数据库
use blog;
9、导入sql文件到数据库blog(注意sql文件的路径)
source /blog.sql;


docker启动redis
1、docker pull redis
2、docker run -d --name redis-blog -p 6379:6379 redis --requirepass "root"
最后一个 "root" 是设置redis密码

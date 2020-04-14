# 设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
FROM node:8.11.3-alpine

# 设置时区
RUN apk --update add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata

# 创建app目录
RUN mkdir -p /usr/src/app/egg-server

# 设置工作目录
WORKDIR /usr/src/app/egg-server

# 拷贝package.json文件到工作目录
# !!重要：package.json需要单独添加。
# Docker在构建镜像的时候，是一层一层构建的，仅当这一层有变化时，重新构建对应的层。
# 如果package.json和源代码一起添加到镜像，则每次修改源码都需要重新安装npm模块，这样木有必要。
# 所以，正确的顺序是: 添加package.json；安装npm模块；添加源代码。
COPY package.json /usr/src/app/egg-server/package.json

# 安装npm依赖(使用淘宝的镜像源)
# 如果使用的境外服务器，无需使用淘宝的镜像源，即改为`RUN npm i`。
# RUN npm i
RUN npm i --registry=https://registry.npm.taobao.org

# 拷贝所有源代码到工作目录
COPY . /usr/src/app/egg-server

# 暴露容器端口
EXPOSE 7001

# 启动node应用
CMD npm start


# 整个过程
# 1.拉取docker镜像（并设置时区等）
# 2.创建docker工作目录，并将package.json拷贝到docker里
# 3.安装npm依赖
# 4.将服务器上的应用拷贝到docker里
# 5.暴露docker容器的端口，然后启动应用



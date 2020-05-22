# 在容器内运行命令
# 拉取要创建的新镜像的 base image（基础镜像），类似于面向对象里边的基础类
FROM node:8.11.3-alpine

# 设置变量
ENV TIME_ZONE=Asia/Shanghai
ENV HOME=/home/app

# 设置时区
RUN \
  apk --update add tzdata \
  && cp /usr/share/zoneinfo/${TIME_ZONE} /etc/localtime \
  && echo "${TIME_ZONE}" > /etc/timezone \
  && apk del tzdata

# 创建app目录
RUN mkdir -p ${HOME}

# 设置工作目录
WORKDIR ${HOME}

# 拷贝，把本机当前目录下的 package.json 拷贝到 Image 的 /usr/src/app/ 文件夹下
COPY package.json ${HOME}

# 使用 npm 安装 app 所需要的所有依赖
RUN npm install --production

# 拷贝本地的所有文件到路径中去
COPY . ${HOME}

# 暴露端口
EXPOSE 7001

# 给容器指定一个执行入口
CMD npm run start
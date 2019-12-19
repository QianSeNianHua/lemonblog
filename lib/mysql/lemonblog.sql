/*
 Navicat Premium Data Transfer

 Source Server         : mariadb
 Source Server Type    : MariaDB
 Source Server Version : 100410
 Source Host           : 127.0.0.1:3306
 Source Schema         : lemonblog

 Target Server Type    : MariaDB
 Target Server Version : 100410
 File Encoding         : 65001

 Date: 19/12/2019 18:42:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `commentId` int(11) NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `userId` int(11) NOT NULL DEFAULT -1 COMMENT '评论者的用户id',
  `createTime` datetime(3) NULL DEFAULT NULL COMMENT '创建时间',
  `nickname` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '评论者的昵称',
  `portraitURL` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像',
  `level` int(1) NULL DEFAULT NULL COMMENT '1表示第一层评论，2表示第二层评论',
  `fatherCommentId` int(11) NULL DEFAULT NULL COMMENT '这是个子评论，它的父评论的评论id',
  `appointCommentId` int(11) NULL DEFAULT NULL COMMENT '@某人的评论id',
  `content` varchar(512) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '评论内容',
  `fileId` int(11) NULL DEFAULT NULL COMMENT '被评论的文章id',
  PRIMARY KEY (`commentId`) USING BTREE,
  INDEX `fileId`(`fileId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '评论区' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES (1, 1, '2019-12-08 17:59:20.000', NULL, NULL, 1, NULL, NULL, '很棒!', 1);
INSERT INTO `comment` VALUES (2, -1, '2019-12-08 18:59:20.000', '容祖儿', NULL, 1, NULL, NULL, '666', 1);
INSERT INTO `comment` VALUES (3, -1, '2019-12-08 19:59:20.000', '马云', NULL, 2, 2, NULL, '你是容祖儿啊', 1);
INSERT INTO `comment` VALUES (4, 1, '2019-12-08 20:59:20.000', NULL, NULL, 2, 2, NULL, '你篡位了', 1);
INSERT INTO `comment` VALUES (5, -1, '2019-12-08 21:59:20.000', '杨幂', NULL, 2, 2, 4, '作者，你好啊', 1);

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file`  (
  `fileId` int(11) NOT NULL AUTO_INCREMENT COMMENT '文章id',
  `title` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章标题',
  `createTime` datetime(3) NULL DEFAULT NULL COMMENT '创建时间',
  `visit` int(11) NULL DEFAULT NULL COMMENT '访问量',
  `contentURL` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章内容',
  `folderId` int(11) NULL DEFAULT NULL COMMENT '分类文件夹的id',
  `userId` int(11) NULL DEFAULT NULL COMMENT '用户id',
  `fileUUID` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章唯一Id',
  PRIMARY KEY (`fileId`) USING BTREE,
  INDEX `folderId`(`folderId`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '文章' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of file
-- ----------------------------
INSERT INTO `file` VALUES (1, '文章一', '2019-12-09 17:59:20.000', 3, 'F:/wamp64/www/egg/files/20191206170950.txt', 1, 1, '0dbe3d99-d554-4312-9512-9d40442e20f9');
INSERT INTO `file` VALUES (2, '文章二', '2019-12-09 18:59:20.000', NULL, 'F:/wamp64/www/egg/files/20191206170950.txt', 1, 1, '297199eb-fa0a-4fef-b92f-9d91eff9b5a5');
INSERT INTO `file` VALUES (3, '文章三', '2019-12-10 17:59:20.000', 50, 'F:/wamp64/www/egg/files/20191206170950.txt', 2, 1, '7e5dc99b-6788-4a6a-8cdb-e071ccee40c1');
INSERT INTO `file` VALUES (4, '文章四', '2019-12-10 18:59:20.000', 41, 'F:/wamp64/www/egg/files/20191206170950.txt', 2, 1, 'd53ddf17-8ad5-45ca-914f-58b6aa2f390e');

-- ----------------------------
-- Table structure for folder
-- ----------------------------
DROP TABLE IF EXISTS `folder`;
CREATE TABLE `folder`  (
  `folderId` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件夹id',
  `folderName` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文件夹名称',
  `createTime` datetime(3) NULL DEFAULT NULL COMMENT '创建时间',
  `userId` int(11) NULL DEFAULT NULL COMMENT '用户id',
  `thumbnailURL` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '缩略图',
  PRIMARY KEY (`folderId`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '文件夹' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of folder
-- ----------------------------
INSERT INTO `folder` VALUES (1, 'aaa', '2019-12-08 17:59:20.000', 1, NULL);
INSERT INTO `folder` VALUES (2, 'bbb', '2019-12-08 18:59:20.000', 1, NULL);
INSERT INTO `folder` VALUES (3, 'xgxxr', '2019-12-19 15:08:14.662', 1, NULL);

-- ----------------------------
-- Table structure for opensource
-- ----------------------------
DROP TABLE IF EXISTS `opensource`;
CREATE TABLE `opensource`  (
  `opensourceId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `introduction` varchar(512) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '介绍',
  `tagIds` varchar(512) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标签id，多个标签用逗号隔开',
  `thumbnailURL` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '缩略图',
  `href` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '链接地址',
  `userId` int(11) NULL DEFAULT NULL COMMENT '用户id',
  PRIMARY KEY (`opensourceId`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '我的开源项目' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of opensource
-- ----------------------------
INSERT INTO `opensource` VALUES (1, '项目一', '介绍内容', '1,2', NULL, 'https://www.baidu.com', 1);

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag`  (
  `tagId` int(11) NOT NULL AUTO_INCREMENT COMMENT '标签id',
  `tagName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标签名',
  PRIMARY KEY (`tagId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '标签' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tag
-- ----------------------------
INSERT INTO `tag` VALUES (1, 'Javascript');
INSERT INTO `tag` VALUES (2, 'Nodejs');
INSERT INTO `tag` VALUES (3, 'vue');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `userId` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `createTime` datetime(3) NULL DEFAULT NULL COMMENT '创建时间',
  `nickname` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `briefIntro` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '个性签名',
  `portraitURL` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像',
  `account` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '账号',
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `otherLogin` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '其他登录方式：微信、QQ、微博',
  `userUUID` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '防止前端直接获取所有用户',
  PRIMARY KEY (`userId`) USING BTREE,
  UNIQUE INDEX `account`(`account`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '2019-12-08 17:59:20.000', '柠檬味的蓝海', NULL, NULL, '528627432', '18923960258', NULL, '93585f57-56fc-f968-9f07-4aaf740d6f89');
INSERT INTO `user` VALUES (2, '2019-12-18 16:11:34.866', 'xzt', NULL, NULL, '123456789', '123123', NULL, '8ac11807-c86f-4caa-9623-3fcb89e9b26c');
INSERT INTO `user` VALUES (5, '2019-12-18 16:38:08.076', 'xzt', NULL, NULL, '1234567890', '123456', NULL, '3ed23eff-9289-4ddf-92d4-68468c6a990f');
INSERT INTO `user` VALUES (6, '2019-12-18 16:38:37.054', '1234', '', '', '12345678901', '123456', NULL, 'f32ff2d3-8a69-4cc5-8da4-2779de71295a');

-- ----------------------------
-- Function structure for countComment
-- ----------------------------
DROP FUNCTION IF EXISTS `countComment`;
delimiter ;;
CREATE FUNCTION `countComment`(_fileId int)
 RETURNS int(11)
BEGIN
	declare re int;
	set re = 0;
	set re = (select count(*) as count from `comment` where fileId = _fileId);
	RETURN re;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for countFileFromFolder
-- ----------------------------
DROP FUNCTION IF EXISTS `countFileFromFolder`;
delimiter ;;
CREATE FUNCTION `countFileFromFolder`(_folderId int)
 RETURNS int(11)
BEGIN
	DECLARE re INT;
	SET re = (SELECT count(*) as count FROM file WHERE folderId = _folderId);
	RETURN re;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for deleteFolder
-- ----------------------------
DROP PROCEDURE IF EXISTS `deleteFolder`;
delimiter ;;
CREATE PROCEDURE `deleteFolder`(IN `_userId` int,IN `_folderId` int)
BEGIN
	DELETE fo, fi, co
		from folder as fo
		LEFT JOIN file as fi ON fo.folderId = fi.folderId
		LEFT JOIN `comment` as co ON fi.fileId = co.fileId
		WHERE fo.folderId = _folderId AND fo.userId = _userId;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;

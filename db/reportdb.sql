/*
 Navicat Premium Data Transfer

 Source Server         : mariadb-3310
 Source Server Type    : MySQL
 Source Server Version : 100315
 Source Host           : localhost:3310
 Source Schema         : reportdb

 Target Server Type    : MySQL
 Target Server Version : 100315
 File Encoding         : 65001

 Date: 22/08/2019 13:43:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for hosp_system
-- ----------------------------
DROP TABLE IF EXISTS `hosp_system`;
CREATE TABLE `hosp_system` (
  `hoscode` varchar(50) NOT NULL,
  `hosname` varchar(200) DEFAULT NULL,
  `topic` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`hoscode`) USING BTREE,
  UNIQUE KEY `idx_hoscode` (`hoscode`) USING BTREE,
  UNIQUE KEY `idx_topic` (`topic`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of hosp_system
-- ----------------------------
BEGIN;
INSERT INTO `hosp_system` VALUES ('10957', 'โรงพยาบาลตาลสุม', '4555654443');
COMMIT;

-- ----------------------------
-- Table structure for rep_levels
-- ----------------------------
DROP TABLE IF EXISTS `rep_levels`;
CREATE TABLE `rep_levels` (
  `level_id` int(11) NOT NULL AUTO_INCREMENT,
  `level_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`level_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of rep_levels
-- ----------------------------
BEGIN;
INSERT INTO `rep_levels` VALUES (1, 'Users', 'เจ้าหน้าที่โรงพยาบาล');
INSERT INTO `rep_levels` VALUES (2, 'Super User', 'องค์กรแพทย์ พยาบาล');
INSERT INTO `rep_levels` VALUES (3, 'Supervisor', 'นักวิชาการคอมพิวเตอร์');
INSERT INTO `rep_levels` VALUES (4, 'Administrator', 'ผู้ดูแลระบบ');
INSERT INTO `rep_levels` VALUES (5, 'TB', 'ผูู้ดูแลโรคติดต่อ');
COMMIT;

-- ----------------------------
-- Table structure for rep_menu_item
-- ----------------------------
DROP TABLE IF EXISTS `rep_menu_item`;
CREATE TABLE `rep_menu_item` (
  `item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) NOT NULL,
  `comment` text DEFAULT NULL,
  `item_status` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of rep_menu_item
-- ----------------------------
BEGIN;
INSERT INTO `rep_menu_item` VALUES (1, 'ผู้ป่วยนอก', 'MDR', 'Y');
INSERT INTO `rep_menu_item` VALUES (2, 'การเงิน', 'การเงิน', 'Y');
INSERT INTO `rep_menu_item` VALUES (7, 'refer', 'refer', 'Y');
INSERT INTO `rep_menu_item` VALUES (8, 'อุบัติเหตุ', NULL, 'Y');
INSERT INTO `rep_menu_item` VALUES (9, 'เสียชีวิต', NULL, 'Y');
INSERT INTO `rep_menu_item` VALUES (10, 'ห้องผ่าตัด', 'or', 'Y');
INSERT INTO `rep_menu_item` VALUES (11, 'ผู้ป่วยใน', 'ipd', 'Y');
INSERT INTO `rep_menu_item` VALUES (12, 'pcu', 'สรุป Hba1c  ราย PCU', 'Y');
INSERT INTO `rep_menu_item` VALUES (13, 'โรคติดต่อ', 'วัณโรค', 'Y');
INSERT INTO `rep_menu_item` VALUES (14, 'ห้องบัตร', 'card', 'Y');
INSERT INTO `rep_menu_item` VALUES (15, 'โรคไม่ติดต่อ', 'โรคจิต', 'Y');
INSERT INTO `rep_menu_item` VALUES (17, 'สูตินารีเวช', 'test', 'Y');
INSERT INTO `rep_menu_item` VALUES (18, 'ศัลยกรรม', 'test', 'Y');
INSERT INTO `rep_menu_item` VALUES (19, 'อายุรกรรม ', 'test', 'Y');
INSERT INTO `rep_menu_item` VALUES (20, 'เด็ก', 'test', 'Y');
INSERT INTO `rep_menu_item` VALUES (21, 'สุขภิบาลและป้องกันโรค', 'สุขภิบาลและป้องกันโรค', 'Y');
COMMIT;

-- ----------------------------
-- Table structure for rep_query_item
-- ----------------------------
DROP TABLE IF EXISTS `rep_query_item`;
CREATE TABLE `rep_query_item` (
  `query_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `query_name` varchar(255) DEFAULT NULL,
  `query_sql` text DEFAULT NULL,
  `query_params` varchar(255) DEFAULT NULL,
  `template` text DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `level_id` enum('0','1','2','3','4') NOT NULL DEFAULT '0',
  `date_update` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`query_id`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rep_users
-- ----------------------------
DROP TABLE IF EXISTS `rep_users`;
CREATE TABLE `rep_users` (
  `user_id` int(4) NOT NULL AUTO_INCREMENT,
  `cid` varchar(13) NOT NULL,
  `fullname` varchar(200) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `device_token` varchar(255) DEFAULT NULL,
  `level_id` enum('0','1','2','3','4') NOT NULL DEFAULT '0',
  `user_type` enum('ADMIN','MEMBER') NOT NULL DEFAULT 'MEMBER',
  `is_accept` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of rep_users
-- ----------------------------
BEGIN;
INSERT INTO `rep_users` VALUES (1, '3341200274298', 'Administartor', 'admin', '383bdcdb33047bf9a8a2bd11f0055d36', NULL, '3', 'ADMIN', 'Y');
COMMIT;

-- ----------------------------
-- Table structure for rep_user_type
-- ----------------------------
DROP TABLE IF EXISTS `rep_user_type`;
CREATE TABLE `rep_user_type` (
  `type_id` int(5) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) NOT NULL,
  `type_status` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of rep_user_type
-- ----------------------------
BEGIN;
INSERT INTO `rep_user_type` VALUES (1, 'General Personnel', 'Y');
INSERT INTO `rep_user_type` VALUES (2, 'User Management', 'Y');
INSERT INTO `rep_user_type` VALUES (3, 'Supervisor', 'Y');
INSERT INTO `rep_user_type` VALUES (4, 'Administrator', 'Y');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

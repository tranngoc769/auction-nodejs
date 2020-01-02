-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 02, 2020 at 08:14 AM
-- Server version: 5.7.26
-- PHP Version: 7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auction`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Catname` varchar(50) NOT NULL,
  `parentID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_parentID_ID` (`parentID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`ID`, `Catname`, `parentID`) VALUES
(1, 'Điện Tử', NULL),
(2, 'Thời Trang', NULL),
(3, 'Xe Cộ', NULL),
(4, 'Điện Thoại & Máy Tính Bảng', 1),
(5, 'Máy tính & Laptop', 1),
(6, 'Quần Áo', 2),
(7, 'Xe máy & Xe đạp', 3),
(8, 'Ô tô', 3),
(9, 'Giày Dép', 2);

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
CREATE TABLE IF NOT EXISTS `history` (
  `userID` int(11) NOT NULL,
  `proID` int(11) NOT NULL,
  `dateBid` datetime NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`userID`,`proID`),
  KEY `FK_his_pro_id` (`proID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ProName` varchar(50) DEFAULT NULL,
  `curPrice` int(11) DEFAULT NULL,
  `catId` int(11) DEFAULT NULL,
  `sellNowPrice` int(11) DEFAULT NULL,
  `stepPrice` int(11) DEFAULT NULL,
  `HighestBidderID` int(11) DEFAULT NULL,
  `countBidder` int(11) DEFAULT NULL,
  `pubDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `ImagePro` varchar(100) DEFAULT NULL,
  `Describle` varchar(10000) DEFAULT NULL,
  `sellerID` int(11) DEFAULT NULL,
  `isExtension` tinyint(1) NOT NULL,
  `startPrice` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_highestID` (`HighestBidderID`),
  KEY `FK_seller_ID` (`sellerID`),
  KEY `FK_catId_ID` (`catId`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`ID`, `ProName`, `curPrice`, `catId`, `sellNowPrice`, `stepPrice`, `HighestBidderID`, `countBidder`, `pubDate`, `endDate`, `ImagePro`, `Describle`, `sellerID`, `isExtension`, `startPrice`) VALUES
(1, 'Laptop Dell', 5000000, 7, 30000000, 500000, 1, 0, '2019-06-07 00:00:00', '2021-06-07 00:00:00', '1577898799760-tranngoc-b3.png', '<p>Đ&acirc;y l&agrave; m&ocirc; tả đầu ti&ecirc;n</p>\r\n\r\n<hr />\r\n<p><strong><img alt=\"\" src=\"http://vesinhvinas.com/edit.png\" style=\"height:16px; width:16px\" /><img alt=\"\" src=\"assets/images/edit.png\" />02-01-2020 13:17:11 </strong></p>\r\n\r\n<p><strong><em>Đ&acirc;y l&agrave; m&ocirc; tả thứ 2 n&egrave;</em></strong></p>\r\n\r\n<hr />\r\n<p><strong><img alt=\"\" src=\"http://vesinhvinas.com/edit.png\" style=\"height:16px; width:16px\" /><img alt=\"\" src=\"assets/images/edit.png\" />02-01-2020 13:18:26 </strong></p>\r\n\r\n<ul style=\"list-style-type:square\">\r\n	<li>\r\n	<h2 style=\"font-style:italic\"><s>Đ&acirc;y l&agrave; m&ocirc; tả thứ 3 hihi</s></h2>\r\n	</li>\r\n	<li><s>Thứ 3 nhỏ</s></li>\r\n	<li><s>Thứ 3 nhỏ</s></li>\r\n</ul>\r\n<hr /><p><strong><img alt=\"\" src=\"http://vesinhvinas.com/edit.png\" style=\"height:16px; width:16px\" /><img alt=\"\" src=\"assets/images/edit.png\" />02-01-2020 13:20:54 </strong></p><p><strong><em><s><img alt=\"\" src=\"http://vesinhvinas.com/edit.png\" style=\"height:16px; width:16px\" />sdasd</s></em></strong></p>\r\n', 2, 0, 50000),
(2, 'Áo bé trai', 50000, 8, 300000, 5000, 3, 0, '2019-06-07 00:00:00', '2022-06-07 00:00:00', '2577898799760-tranngoc-b3.png', '<p>Đẹp, tốt</p>\r\n\r\n<p><strong><img alt=\"\" src=\"http://vesinhvinas.com/edit.png\" style=\"height:16px; width:16px\" /><img alt=\"\" src=\"assets/images/edit.png\" />02-01-2020 13:52:08 </strong></p>\r\n\r\n<p><strong><em>dfsdsf</em></strong></p>\r\n<p><strong><img alt=\"\" src=\"http://vesinhvinas.com/edit.png\" style=\"height:16px; width:16px\" /><img alt=\"\" src=\"assets/images/edit.png\" />02-01-2020 13:52:21 </strong></p><p><strong><em>szds</em></strong></p>\r\n', 2, 0, 50000),
(3, 'Samsung Galaxy A51', 7990000, 7, 15000000, 1000000, NULL, 0, '2019-12-03 12:00:00', '2019-12-04 11:59:00', '/images/9.png', 'Tự hào là smartphone đầu tiên trên thế giới được tích hợp camera Macro hỗ trợ chụp ảnh cận cảnh, Gal', 3, 0, 50000),
(4, 'HONDA CIVIC 1.5TOP', 599000000, 8, 699000000, 10000000, NULL, 0, '2019-12-30 00:00:00', '2019-12-31 00:00:00', NULL, 'BỨC PHÁ MẠNH MẼ CÙNG HONDA CIVIC NHẬP KHẨU NGUYÊN CHIẾC TỪ THÁI LAN', 3, 0, 50000),
(5, 'Giày bé trai S.pro.x', 235000, 9, 500000, 10000, 3, 0, '2019-12-30 00:00:00', '2019-12-31 00:00:00', NULL, 'Giày bé trai của hãng Sp.rox. hãng này cũng đã về VIệt Nam rồi, giá k đôi nào dưới 1tr đâu ạ.\r\nMã nà', 3, 0, 50000),
(22, 'Quang', 1, 4, 1, 1, NULL, 0, '2020-02-01 19:30:00', '2020-02-11 19:30:00', '1577898374783-tranngoc-B1.PNG', '', 3, 0, 50000),
(23, 'Quang', 1, 4, 1, 1, NULL, 0, '2020-02-01 19:30:00', '2020-02-11 19:30:00', '1577898479309-tranngoc-bracket.png', '', 3, 0, 50000),
(24, 'Quang', 1, 4, 1, 1, NULL, 0, '2020-02-01 19:30:00', '2020-02-11 19:30:00', '1577898558227-tranngoc-percent.png', '', 3, 0, 50000),
(25, 'Quang', 1, 4, 1, 1, NULL, 0, '2020-02-01 19:30:00', '2020-02-11 19:30:00', '1577898635493-tranngoc-div.png', '', 3, 0, 50000),
(26, 'Quang', 1, 4, 1, 1, NULL, 0, '2020-02-01 19:30:00', '2020-02-11 19:30:00', '1577898799760-tranngoc-b3.png', '<p><strong>sadasdasda <s>asda</s></strong></p>\r\n', 3, 0, 50000),
(27, 'Quang', 1, 4, 1, 1, NULL, 0, '2020-02-01 19:30:00', '2020-02-11 19:30:00', '1577950796587-tranngoc-mansion.png', '', 3, 1, 1),
(28, 'Quang', 1, 4, 1, 1, NULL, 0, '2020-02-01 19:30:00', '2020-02-11 19:30:00', '1577950897339-tranngoc-mansion.png', '<hr /><p><strong><img alt=\"\" src=\"http://vesinhvinas.com/edit.png\" style=\"height:16px; width:16px\" /><img alt=\"\" src=\"assets/images/edit.png\" />02-01-2020 14:41:37 </strong></p> ', 3, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_image`
--

DROP TABLE IF EXISTS `product_image`;
CREATE TABLE IF NOT EXISTS `product_image` (
  `proID` int(11) NOT NULL,
  `image` varchar(100) NOT NULL,
  KEY `FK_pro` (`proID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_image`
--

INSERT INTO `product_image` (`proID`, `image`) VALUES
(22, '1577898374787-tranngoc-b2.png'),
(22, '1577898374788-tranngoc-b3.png'),
(22, '1577898374790-tranngoc-B4.PNG'),
(22, '1577898374792-tranngoc-b5.png'),
(22, ''),
(23, '1577898479312-tranngoc-clear.png'),
(23, '1577898479313-tranngoc-div.png'),
(23, ''),
(24, '1577898558229-tranngoc-plus.png'),
(24, '1577898558230-tranngoc-plusmin.png'),
(24, ''),
(25, '1577898635495-tranngoc-dot.png'),
(25, '1577898635497-tranngoc-equal.png'),
(26, '1577898799764-tranngoc-B4.PNG'),
(26, '1577898799765-tranngoc-b5.png'),
(26, '1577898799768-tranngoc-b6.png'),
(26, '1577898799769-tranngoc-b7.png'),
(26, '1577898799770-tranngoc-b8.png'),
(26, '1577898799772-tranngoc-b9.png'),
(26, '1577898799773-tranngoc-bracket.png'),
(26, '1577898799774-tranngoc-clear.png'),
(26, '1577898799775-tranngoc-div.png'),
(26, '1577898799776-tranngoc-dot.png'),
(26, '1577898799779-tranngoc-equal.png'),
(27, '1577950796589-tranngoc-iconfinder_User_85225.png'),
(27, '1577950796590-tranngoc-boy.png'),
(28, '1577950897343-tranngoc-iconfinder_User_85225.png'),
(28, '1577950897344-tranngoc-boy.png');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `byname` varchar(111) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `byname`) VALUES
(1, 'admin'),
(2, 'bidder'),
(3, 'seller');

-- --------------------------------------------------------

--
-- Table structure for table `sellerreviewtobidder`
--

DROP TABLE IF EXISTS `sellerreviewtobidder`;
CREATE TABLE IF NOT EXISTS `sellerreviewtobidder` (
  `bidderID` int(11) NOT NULL,
  `sellerID` int(11) NOT NULL,
  `Vote` tinyint(1) DEFAULT NULL,
  `comment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`bidderID`,`sellerID`),
  KEY `FK_seller_id_id` (`sellerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sellerreviewtobidder`
--

INSERT INTO `sellerreviewtobidder` (`bidderID`, `sellerID`, `Vote`, `comment`) VALUES
(2, 3, 1, 'Good good');

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

DROP TABLE IF EXISTS `user_account`;
CREATE TABLE IF NOT EXISTS `user_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(111) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(111) COLLATE utf8_unicode_ci NOT NULL,
  `id_role` int(1) NOT NULL,
  `isDeleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`id`, `username`, `password`, `id_role`, `isDeleted`) VALUES
(1, 'tranngoc769', '111111', 1, b'0'),
(2, 'tranngoc7699', '111111', 2, b'0'),
(3, 'tranngoc', '111111', 3, b'0');

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
CREATE TABLE IF NOT EXISTS `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountID` int(11) NOT NULL,
  `fullName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `DOB` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`id`, `accountID`, `fullName`, `email`, `phone`, `DOB`) VALUES
(1, 1, 'kumeo123', 'kumeo@gmail.com', '0855547046', '1999-09-19'),
(2, 2, 'kumeo', 'kumeo@gmail.com', '0855547046', '1999-09-19'),
(3, 3, 'aloABC', 'abc@gmail.com', '0855547046', '1999-03-01');

-- --------------------------------------------------------

--
-- Table structure for table `watchlist`
--

DROP TABLE IF EXISTS `watchlist`;
CREATE TABLE IF NOT EXISTS `watchlist` (
  `userID` int(11) NOT NULL,
  `proID` int(11) NOT NULL,
  PRIMARY KEY (`userID`,`proID`),
  KEY `FK_wl_pro` (`proID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `watchlist`
--

INSERT INTO `watchlist` (`userID`, `proID`) VALUES
(2, 1),
(2, 2);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `FK_parentID_ID` FOREIGN KEY (`parentID`) REFERENCES `category` (`ID`);

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `FK_his_id` FOREIGN KEY (`userID`) REFERENCES `user_account` (`id`),
  ADD CONSTRAINT `FK_his_pro_id` FOREIGN KEY (`proID`) REFERENCES `product` (`ID`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK_catId_ID` FOREIGN KEY (`catId`) REFERENCES `category` (`ID`),
  ADD CONSTRAINT `FK_highestID` FOREIGN KEY (`HighestBidderID`) REFERENCES `user_account` (`id`),
  ADD CONSTRAINT `FK_seller_ID` FOREIGN KEY (`sellerID`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `product_image`
--
ALTER TABLE `product_image`
  ADD CONSTRAINT `FK_pro` FOREIGN KEY (`proID`) REFERENCES `product` (`ID`);

--
-- Constraints for table `sellerreviewtobidder`
--
ALTER TABLE `sellerreviewtobidder`
  ADD CONSTRAINT `FK_seller_id_id` FOREIGN KEY (`sellerID`) REFERENCES `user_account` (`id`),
  ADD CONSTRAINT `FK_seller_review` FOREIGN KEY (`bidderID`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD CONSTRAINT `FK_wl_pro` FOREIGN KEY (`proID`) REFERENCES `product` (`ID`),
  ADD CONSTRAINT `FK_wl_user` FOREIGN KEY (`userID`) REFERENCES `user_account` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

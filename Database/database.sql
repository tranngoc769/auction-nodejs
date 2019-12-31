-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 31, 2019 at 05:57 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

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

CREATE TABLE `category` (
  `ID` int(11) NOT NULL,
  `Catname` varchar(50) NOT NULL,
  `parentID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

CREATE TABLE `history` (
  `userID` int(11) NOT NULL,
  `proID` int(11) NOT NULL,
  `dateBid` datetime NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `ID` int(11) NOT NULL,
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
  `Describle` varchar(300) DEFAULT NULL,
  `sellerID` int(11) DEFAULT NULL,
  `isExtension` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`ID`, `ProName`, `curPrice`, `catId`, `sellNowPrice`, `stepPrice`, `HighestBidderID`, `countBidder`, `pubDate`, `endDate`, `ImagePro`, `Describle`, `sellerID`, `isExtension`) VALUES
(1, 'Laptop Dell', 5000000, 7, 30000000, 500000, NULL, 0, '2019-06-07 00:00:00', '2019-06-07 00:00:00', '.../images/1.png', 'Tốt, nhanh', 2, 0),
(2, 'Áo bé trai', 50000, 8, 300000, 5000, NULL, 0, '2019-06-07 00:00:00', '2019-06-07 00:00:00', '.../images/2.png', 'Đẹp, tốt', 2, 0),
(3, 'Samsung Galaxy A51', 7990000, 7, 15000000, 1000000, NULL, 0, '2019-12-03 12:00:00', '2019-12-04 11:59:00', '/images/9.png', 'Tự hào là smartphone đầu tiên trên thế giới được tích hợp camera Macro hỗ trợ chụp ảnh cận cảnh, Gal', 3, 0),
(4, 'HONDA CIVIC 1.5TOP', 599000000, 8, 699000000, 10000000, NULL, 0, '2019-12-30 00:00:00', '2019-12-31 00:00:00', NULL, 'BỨC PHÁ MẠNH MẼ CÙNG HONDA CIVIC NHẬP KHẨU NGUYÊN CHIẾC TỪ THÁI LAN', 3, 0),
(5, 'Giày bé trai S.pro.x', 235000, 9, 500000, 10000, NULL, 0, '2019-12-30 00:00:00', '2019-12-31 00:00:00', NULL, 'Giày bé trai của hãng Sp.rox. hãng này cũng đã về VIệt Nam rồi, giá k đôi nào dưới 1tr đâu ạ.\r\nMã nà', 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_image`
--

CREATE TABLE `product_image` (
  `proID` int(11) NOT NULL,
  `image` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `byname` varchar(111) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

CREATE TABLE `sellerreviewtobidder` (
  `bidderID` int(11) NOT NULL,
  `sellerID` int(11) NOT NULL,
  `Vote` tinyint(1) DEFAULT NULL,
  `comment` varchar(100) DEFAULT NULL
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

CREATE TABLE `user_account` (
  `id` int(11) NOT NULL,
  `username` varchar(111) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(111) COLLATE utf8_unicode_ci NOT NULL,
  `id_role` int(1) NOT NULL,
  `isDeleted` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`id`, `username`, `password`, `id_role`, `isDeleted`) VALUES
(1, 'kumeoabc', '123456789', 1, b'0'),
(2, 'kumeo123', '123456789', 2, b'0'),
(3, 'kumeo', '123456789', 3, b'0');

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `id` int(11) NOT NULL,
  `accountID` int(11) NOT NULL,
  `fullName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `DOB` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

CREATE TABLE `watchlist` (
  `userID` int(11) NOT NULL,
  `proID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `watchlist`
--

INSERT INTO `watchlist` (`userID`, `proID`) VALUES
(2, 1),
(2, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_parentID_ID` (`parentID`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`userID`,`proID`),
  ADD KEY `FK_his_pro_id` (`proID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_highestID` (`HighestBidderID`),
  ADD KEY `FK_seller_ID` (`sellerID`),
  ADD KEY `FK_catId_ID` (`catId`);

--
-- Indexes for table `product_image`
--
ALTER TABLE `product_image`
  ADD KEY `FK_pro` (`proID`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sellerreviewtobidder`
--
ALTER TABLE `sellerreviewtobidder`
  ADD PRIMARY KEY (`bidderID`,`sellerID`),
  ADD KEY `FK_seller_id_id` (`sellerID`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD PRIMARY KEY (`userID`,`proID`),
  ADD KEY `FK_wl_pro` (`proID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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

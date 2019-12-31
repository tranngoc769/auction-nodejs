-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 06, 2019 lúc 06:16 PM
-- Phiên bản máy phục vụ: 10.4.8-MariaDB
-- Phiên bản PHP: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `auction`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `byname` varchar(111) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `byname`) VALUES
(1, 'admin'),
(2, 'bidder'),
(3, 'seller');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_account`
--

CREATE TABLE `user_account` (
  `id` int(11) NOT NULL,
  `username` varchar(111) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(111) COLLATE utf8_unicode_ci NOT NULL,
  `id_role` int(1) NOT NULL,
  `isDeleted` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_account`
--

INSERT INTO `user_account` (`id`, `username`, `password`, `id_role`, `isDeleted`) VALUES
(1, 'kumeoabc', '123456789', 1, b'0'),
(2, 'kumeo123', '123456789', 2, b'0'),
(3, 'kumeo', '123456789', 3, b'0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_info`
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
-- Đang đổ dữ liệu cho bảng `user_info`
--

INSERT INTO `user_info` (`id`, `accountID`, `fullName`, `email`, `phone`, `DOB`) VALUES
(1, 1, 'kumeo123', 'kumeo@gmail.com', '0855547046', '1999-09-19'),
(2, 2, 'kumeo', 'kumeo@gmail.com', '0855547046', '1999-09-19'),
(3, 3, 'aloABC', 'abc@gmail.com', '0855547046', '1999-03-01');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `user_account`
--
ALTER TABLE `user_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `user_info`
--
ALTER TABLE `user_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


CREATE TABLE Category(
	ID int primary key,
	Catname varchar(50) NOT NULL,
	parentID int
    
);
CREATE TABLE History(
	userID int NOT NULL,
	proID int NOT NULL,
	dateBid datetime NOT NULL,
	price int NOT NULL,
	CONSTRAINT PK_HISTORY 
	PRIMARY KEY(userID,proID)
);

CREATE TABLE Product(
	ID int   primary key AUTO_INCREMENT,
	ProName varchar(50),
	curPrice int,
	catId int,
	sellNowPrice int,
	stepPrice int,
	HighestBidderID int,
	countBidder int,
	pubDate datetime,
	endDate datetime,
	ImagePro varchar(100),
	Describle varchar(100),
	sellerID int
	);
/****** Object:  Table Product_image    Script Date: 12/31/2019 1:32:48 PM ******/

CREATE TABLE Product_image(
	proID int NOT NULL,
	image varchar(100) NOT NULL
);


CREATE TABLE SellerReviewToBidder(
	bidderID int,
	sellerID int,
	Vote bit,
	comment varchar(100),
	CONSTRAINT PK_SellerReview 
	PRIMARY KEY(bidderID,sellerID)
);
CREATE TABLE WatchList(
	userID int,
	proID int,
	CONSTRAINT PK_WatchList 
	PRIMARY KEY(userID,proID)
);

alter table Category add
	constraint FK_parentID_ID foreign key (parentID)
	references Category (ID)
;

alter table Product add
	constraint FK_highestID foreign key (HighestBidderID)
	references user_account (id);
alter table Product add
	constraint FK_seller_ID foreign key (sellerID)
	references user_account (id);
alter table Product add
	constraint FK_catId_ID foreign key (catId)
	references Category (ID)
;

alter table Product_image add
	constraint FK_pro foreign key (proID)
	references Product (ID)
;
alter table History add
	constraint FK_his_id foreign key (userID)
	references user_account (id);
    alter table History add
constraint FK_his_pro_id foreign key (proID)
	references Product (ID)

;
alter table SellerReviewToBidder add
	constraint FK_seller_review foreign key (bidderID)
	references user_account (id);
    alter table SellerReviewToBidder add
constraint FK_seller_id_id foreign key (sellerID)
	references user_account (id)

;
alter table WatchList add
	constraint FK_wl_user foreign key (userID)
	references user_account (id);
    alter table WatchList add
constraint FK_wl_pro foreign key (proID)
	references Product (ID)
;



insert into Category (Id,Catname,parentID)
values 
(1,N'Điện Tử',NULL),
(2,N'Thời Trang',NULL),
(3,N'Xe Cộ',NULL)

;
insert into Category (Id,Catname,parentID)
values 
(6,N'Điện Thoại & Máy Tính Bảng',1),
(7,N'Máy tính & Laptop',1),
(8,N'Quần Áo',2),
(9,N'Xe máy & Xe đạp',3),
(10,N'Ô tô',3),
(11,N'Giày Dép',2)
;




insert into Product(ProName, curPrice,catId, sellNowPrice, stepPrice, HighestBidderID, countBidder, pubDate, endDate,  ImagePro, Describle, sellerID)
values 
('Laptop Dell',5000000, 7, 30000000,500000,NULL,0,'2019-06-07', '2019-06-07', '.../images/1.png',N'Tốt, nhanh',2 ),
('Áo bé trai',50000, 8, 300000,5000,NULL,0,'2019-06-07', '2019-06-07', '.../images/2.png',N'Đẹp, tốt',2 )

;

insert into WatchList (userID, proID)
values 
(1,1),
(1,2)

;
insert into SellerReviewToBidder(bidderID, sellerID, Vote, comment)
values 
(1,2, 1, 'Tốt, giỏi')

CREATE TABLE `Account`
(
	ID int primary key AUTO_INCREMENT,
	FullName varchar(50),
	Passuser varchar(100),
	Address_user varchar(100),
	Phone varchar(12),
	RoleID int DEFAULT 0,
	isDeleted int DEFAULT 0,
	dob datetime,
	Email varchar(50)
);
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
CREATE TABLE Role(
	Id int PRIMARY KEY,
	Rolename varchar(50) NULL
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

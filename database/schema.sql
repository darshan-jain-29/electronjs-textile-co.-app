drop table if exists `dispatchmaster`;
drop table if exists `dispatchrows`;
drop table if exists `dyeingreceivalmaster`;
drop table if exists `dyeingreceivalrows`;
drop table if exists `finishgrmaster`;
drop table if exists `finishgrrows`;
drop table if exists `finishpurchasemaster`;
drop table if exists `finishpurchaserows`;
drop table if exists `greypomaster`;
drop table if exists `greyporows`;
drop table if exists `grmaster`;
drop table if exists `grrows`;
drop table if exists `logincredentials`;
drop table if exists `openingstock`;
drop table if exists `partiesmaster`;
drop table if exists `qsc`;
drop table if exists `salepomaster`;
drop table if exists `saleporows`;
drop table if exists `seriesnumber`;
drop table if exists `states`;
drop table if exists `stockmaster`;
drop table if exists `stockrows`;

CREATE TABLE IF NOT EXISTS `dispatchmaster` (
  `dUNumber` varchar(45) DEFAULT NULL,
  `salePoNumber` varchar(45) DEFAULT NULL,
  `invoiceNumber` varchar(45) DEFAULT NULL,
  `dispatchDate` varchar(45) DEFAULT NULL,
  `lrNo` varchar(45) DEFAULT NULL,
  `transportName` varchar(200) DEFAULT NULL,
  `shippingAddress` longtext,
  `haste` varchar(200) DEFAULT NULL,
  `rollsDelivering` varchar(45) DEFAULT '0',
  `qtyDelivering` varchar(45) DEFAULT '0',
  `qtyGR` varchar(45) DEFAULT '0'
);

CREATE TABLE IF NOT EXISTS `dispatchrows` (
  `dUNumber` varchar(45) DEFAULT NULL,
  `invoiceNumber` varchar(45) DEFAULT NULL,
  `qualityName` varchar(100) DEFAULT NULL,
  `shade` varchar(45) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `conditions` varchar(45) DEFAULT NULL,
  `lotNo` varchar(45) DEFAULT NULL,
  `rollNo` varchar(45) DEFAULT NULL,
  `qty` varchar(45) DEFAULT '0',
  `grQty` varchar(45) DEFAULT '0',
  `rate` varchar(45) DEFAULT '0'
) ; 

CREATE TABLE IF NOT EXISTS `dyeingreceivalmaster` (
  `dRNumber` varchar(45) DEFAULT NULL,
  `uPoNumber` varchar(45) DEFAULT NULL,
  `poNumber` varchar(45) DEFAULT NULL,
  `lotNo` varchar(45) DEFAULT NULL,
  `receivingDate` varchar(45) DEFAULT NULL,
  `greyQualityName` varchar(100) DEFAULT NULL,
  `rollsReceiving` varchar(45) DEFAULT NULL,
  `qtyReceiving` varchar(45) DEFAULT NULL,
  `finishQualityName` varchar(100) DEFAULT NULL,
  `isDamage` varchar(45) DEFAULT 'false'
) ;

CREATE TABLE IF NOT EXISTS `dyeingreceivalrows` (
  `dRNumber` varchar(45) DEFAULT NULL,
  `uPoNumber` varchar(45) DEFAULT NULL,
  `lotNo` varchar(45) DEFAULT NULL,
  `receivingDate` varchar(45) DEFAULT NULL,
  `greyQuality` varchar(100) DEFAULT NULL,
  `qualityName` varchar(100) DEFAULT NULL,
  `shade` varchar(100) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `qty` varchar(45) DEFAULT NULL,
  `isDamage` varchar(45) DEFAULT 'false'
) ;

CREATE TABLE IF NOT EXISTS `finishgrmaster` (
  `grSeries` varchar(50) DEFAULT NULL,
  `invoiceNo` varchar(45) DEFAULT NULL,
  `totalRolls` varchar(45) DEFAULT NULL,
  `totalQty` varchar(45) DEFAULT NULL,
  `partyName` varchar(300) DEFAULT NULL,
  `brokerName` varchar(300) DEFAULT NULL
) ;
 
CREATE TABLE IF NOT EXISTS `finishgrrows` (
  `grSeries` varchar(45) DEFAULT NULL,
  `invoiceNo` varchar(45) DEFAULT NULL,
  `dateOfGR` varchar(45) DEFAULT NULL,
  `qualityName` varchar(200) DEFAULT NULL,
  `shade` varchar(100) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `condition` varchar(45) DEFAULT NULL,
  `lotNo` varchar(100) DEFAULT NULL,
  `rollNo` varchar(100) DEFAULT NULL,
  `qty` varchar(45) DEFAULT NULL
) ;
 
CREATE TABLE IF NOT EXISTS `finishpurchasemaster` (
  `nFNumber` varchar(45) DEFAULT NULL,
  `billNumber` varchar(45) DEFAULT NULL,
  `dateOfPurchase` varchar(45) DEFAULT NULL,
  `lotNo` varchar(45) DEFAULT NULL,
  `partyName` varchar(100) DEFAULT NULL,
  `brokerName` varchar(100) DEFAULT NULL,
  `totalRolls` varchar(45) DEFAULT NULL,
  `totalQty` varchar(45) DEFAULT NULL,
  `totalAmount` varchar(45) DEFAULT NULL,
  `grQty` varchar(45) DEFAULT '0'
) ;

CREATE TABLE IF NOT EXISTS `finishpurchaserows` (
  `nFNumber` varchar(45) DEFAULT NULL,
  `billNumber` varchar(45) DEFAULT NULL,
  `lotNo` varchar(45) DEFAULT NULL,
  `qualityName` varchar(45) DEFAULT NULL,
  `shade` varchar(45) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `qty` varchar(45) DEFAULT NULL,
  `rollNumber` varchar(45) DEFAULT NULL,
  `rate` varchar(45) DEFAULT NULL,
  `grQty` varchar(45) DEFAULT '0'
) ;

CREATE TABLE IF NOT EXISTS `greypomaster` (
  `uPoNumber` varchar(45) DEFAULT NULL,
  `poNumber` varchar(50) DEFAULT NULL,
  `dateOfPoIssue` varchar(45) DEFAULT NULL,
  `partyName` varchar(255) DEFAULT NULL,
  `dyeingName` varchar(100) DEFAULT NULL,
  `brokerName` varchar(100) DEFAULT NULL,
  `totalRolls` varchar(45) DEFAULT NULL,
  `totalQty` varchar(45) DEFAULT NULL,
  `netAmount` varchar(45) DEFAULT NULL,
  `rollsReceived` varchar(45) DEFAULT NULL,
  `qtyReceived` varchar(45) DEFAULT NULL,
  `totalDamage` varchar(45) DEFAULT NULL,
  `shrinkage` varchar(45) DEFAULT '0',
  `lotNo` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL
) ;

CREATE TABLE IF NOT EXISTS `greyporows` (
  `uPoNumber` varchar(45) DEFAULT NULL,
  `poNumber` varchar(45) DEFAULT NULL,
  `qualityName` varchar(100) DEFAULT NULL,
  `noOfRolls` varchar(45) DEFAULT NULL,
  `qty` varchar(45) DEFAULT NULL,
  `rate` varchar(45) DEFAULT NULL,
  `rollsReceived` varchar(45) DEFAULT '0',
  `qtyReceived` varchar(45) DEFAULT NULL,
  `damageReceived` varchar(45) DEFAULT NULL
) ;

CREATE TABLE IF NOT EXISTS `grmaster` (
  `grSeries` varchar(50) DEFAULT NULL,
  `invoiceNo` varchar(45) DEFAULT NULL,
  `totalRolls` varchar(45) DEFAULT NULL,
  `totalQty` varchar(45) DEFAULT NULL,
  `partyName` varchar(300) DEFAULT NULL,
  `brokerName` varchar(300) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `grrows` (
  `grSeries` varchar(45) DEFAULT NULL,
  `invoiceNo` varchar(45) DEFAULT NULL,
  `dateOfGR` varchar(45) DEFAULT NULL,
  `qualityName` varchar(200) DEFAULT NULL,
  `shade` varchar(100) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `condition` varchar(45) DEFAULT NULL,
  `lotNo` varchar(100) DEFAULT NULL,
  `rollNo` varchar(100) DEFAULT NULL,
  `qty` varchar(45) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `logincredentials` (
  `username` varchar(200) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `isadmin` tinyint(4) DEFAULT '0'
) ;
 
CREATE TABLE IF NOT EXISTS `openingstock` (
  `oSNumber` varchar(45) DEFAULT NULL,
  `dateOfEntry` varchar(45) DEFAULT NULL,
  `lotNo` varchar(50) DEFAULT NULL,
  `isDamage` varchar(45) DEFAULT NULL,
  `qualityName` varchar(100) DEFAULT NULL,
  `shade` varchar(100) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `qty` varchar(45) DEFAULT NULL,
  `rollNo` varchar(45) DEFAULT NULL
) ;
  
CREATE TABLE IF NOT EXISTS `partiesmaster` (
  `partyName` varchar(200) NOT NULL,
  `gstNo` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `codeNo` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` longtext,
  `address2` longtext,
  `address3` longtext,
  `contactNumber` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL
) ;
 
CREATE TABLE IF NOT EXISTS `qsc` (
  `name` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL
) ;
 
CREATE TABLE IF NOT EXISTS `salepomaster` (
  `sPNumber` varchar(45) DEFAULT NULL,
  `salePoNumber` varchar(45) DEFAULT NULL,
  `dateOfPoIssue` varchar(45) DEFAULT NULL,
  `dateOfDelivery` varchar(45) DEFAULT NULL,
  `partyName` varchar(100) DEFAULT NULL,
  `brokerName` varchar(100) DEFAULT NULL,
  `totalQty` varchar(45) DEFAULT '0',
  `totalAmt` varchar(45) DEFAULT '0',
  `totalRollsDelivered` varchar(45) DEFAULT '0',
  `totalQtyDelivered` varchar(45) DEFAULT '0',
  `deliveryNo` varchar(45) DEFAULT '1',
  `status` varchar(45) DEFAULT 'PENDING'
) ;

CREATE TABLE IF NOT EXISTS `saleporows` (
  `sPNumber` varchar(45) DEFAULT NULL,
  `salePoNumber` varchar(45) DEFAULT NULL,
  `qualityName` varchar(100) DEFAULT NULL,
  `shade` varchar(45) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `conditions` varchar(45) DEFAULT NULL,
  `qty` varchar(45) DEFAULT '0',
  `rate` varchar(45) DEFAULT '0',
  `rollsDelivered` varchar(45) DEFAULT NULL,
  `qtyDelivered` varchar(45) DEFAULT '0',
  `status` varchar(45) DEFAULT '0'
) ;

CREATE TABLE IF NOT EXISTS `seriesnumber` (
  `seriesName` varchar(50) DEFAULT NULL,
  `seriesValue` varchar(45) DEFAULT NULL,
  `useCase` varchar(100) DEFAULT NULL
) ;

CREATE TABLE IF NOT EXISTS `states` (`statename` varchar(50) NOT NULL) ;

CREATE TABLE IF NOT EXISTS `stockmaster` (
  `qualityName` varchar(100) DEFAULT NULL,
  `rolls` varchar(45) DEFAULT '0',
  `qty` varchar(45) DEFAULT '0',
  `damage` varchar(45) DEFAULT '0',
  `pendingOrders` varchar(45) DEFAULT '0'
) ;

CREATE TABLE IF NOT EXISTS `stockrows` (
  `rollsSeries` varchar(45) DEFAULT NULL,
  `lotNo` varchar(45) DEFAULT NULL,
  `qualityName` varchar(100) DEFAULT NULL,
  `shade` varchar(100) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `qty` varchar(45) DEFAULT NULL,
  `isDamage` varchar(45) DEFAULT 'false'
) ;

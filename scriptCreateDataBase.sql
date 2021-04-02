-- XITUMUL MANUEL, LESTHER CARLOS HORALDO
-- 20000742
-- DDL -> DATA BASE -> TABLE SAVE DATA
DELIMITER %%
-- DROP SCHEMA IF EXISTS `activiad05tds`;
CREATE DATABASE `activiad05tds`;
CREATE TABLE `activiad05tds`.`pictures` (
  `idPictureSaved` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(50) NOT NULL,
  `fechaHora` DATETIME NOT NULL,
  `type` VARCHAR(25) NOT NULL,
  `tags` VARCHAR(100) NOT NULL,
  `user` VARCHAR(25) NOT NULL,
  `views` VARCHAR(25) NOT NULL,
  `downloads` VARCHAR(25) NOT NULL,
  `linkPicture` VARCHAR(1000) NOT NULL,
  PRIMARY KEY (`idPictureSaved`),
  UNIQUE INDEX `codigo_UNIQUE` (`codigo` ASC) VISIBLE)
COMMENT = 'Las descargas las declaré como {varchar} debido a que si se guardan con un 
tipo de dato entero o en todo caso, numérico, ocupariá demasiados Bytes en la DB.'; 
%% DELIMITER ; 
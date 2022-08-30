-- MySQL Script generated by MySQL Workbench
-- Tue Aug 30 19:38:13 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema help_ukr
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema help_ukr
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `help_ukr` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `help_ukr` ;

-- -----------------------------------------------------
-- Table `help_ukr`.`states`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `help_ukr`.`states` (
  `id` TINYINT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `state_UNIQUE` (`name` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `help_ukr`.`languages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `help_ukr`.`languages` (
  `id` TINYINT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
  `lang` VARCHAR(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `lang_UNIQUE` (`lang` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `help_ukr`.`countries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `help_ukr`.`countries` (
  `id` TINYINT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `value` VARCHAR(50) NOT NULL,
  `lang_id` TINYINT(4) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`, `lang_id`),
  UNIQUE INDEX `country_UNIQUE` (`name` ASC, `lang_id` ASC),
  INDEX `country_lang_idx` (`lang_id` ASC),
  CONSTRAINT `country_lang`
    FOREIGN KEY (`lang_id`)
    REFERENCES `help_ukr`.`languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `help_ukr`.`cities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `help_ukr`.`cities` (
  `id` SMALLINT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `value` VARCHAR(50) NOT NULL,
  `country_id` TINYINT(4) UNSIGNED NOT NULL,
  `lang_id` TINYINT(4) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`, `lang_id`),
  UNIQUE INDEX `city_UNIQUE` (`name` ASC, `country_id` ASC, `lang_id` ASC),
  INDEX `country_id_countries_idx` (`country_id` ASC),
  INDEX `city_lang_idx` (`lang_id` ASC),
  CONSTRAINT `country_id_countries`
    FOREIGN KEY (`country_id`)
    REFERENCES `help_ukr`.`countries` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `city_lang`
    FOREIGN KEY (`lang_id`)
    REFERENCES `help_ukr`.`languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `help_ukr`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `help_ukr`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `lang_id` TINYINT(4) UNSIGNED NOT NULL,
  `state_id` TINYINT(4) UNSIGNED NOT NULL,
  `country_id` TINYINT(4) UNSIGNED NULL,
  `city_id` SMALLINT(5) UNSIGNED NULL,
  PRIMARY KEY (`id`),
  INDEX `state_id_state_idx` (`state_id` ASC),
  INDEX `lang_id_lang_idx` (`lang_id` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `country_id_idx` (`country_id` ASC),
  INDEX `city_id_idx` (`city_id` ASC),
  CONSTRAINT `state_id_state`
    FOREIGN KEY (`state_id`)
    REFERENCES `help_ukr`.`states` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `lang_id_lang`
    FOREIGN KEY (`lang_id`)
    REFERENCES `help_ukr`.`languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `country_id`
    FOREIGN KEY (`country_id`)
    REFERENCES `help_ukr`.`countries` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `city_id`
    FOREIGN KEY (`city_id`)
    REFERENCES `help_ukr`.`cities` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `help_ukr`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `help_ukr`.`categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `value` VARCHAR(50) NOT NULL,
  `city_id` SMALLINT(5) UNSIGNED NOT NULL,
  `lang_id` TINYINT(4) UNSIGNED NOT NULL,
  `parent_id` INT UNSIGNED NULL,
  PRIMARY KEY (`id`, `lang_id`),
  UNIQUE INDEX `categories_UNIQUE` (`name` ASC, `city_id` ASC, `lang_id` ASC, `parent_id` ASC),
  INDEX `cat_lang_idx` (`lang_id` ASC),
  INDEX `cat_city_idx` (`city_id` ASC),
  INDEX `parent_id_idx` (`parent_id` ASC),
  CONSTRAINT `cat_lang`
    FOREIGN KEY (`lang_id`)
    REFERENCES `help_ukr`.`languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `cat_city`
    FOREIGN KEY (`city_id`)
    REFERENCES `help_ukr`.`cities` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `parent_id`
    FOREIGN KEY (`parent_id`)
    REFERENCES `help_ukr`.`categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `help_ukr`.`text`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `help_ukr`.`text` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `value` VARCHAR(4095) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `lang_id` TINYINT(4) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`, `lang_id`),
  UNIQUE INDEX `id_UNIQUE` (`name` ASC, `lang_id` ASC),
  INDEX `text_lang_idx` (`lang_id` ASC),
  CONSTRAINT `text_lang`
    FOREIGN KEY (`lang_id`)
    REFERENCES `help_ukr`.`languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `help_ukr`.`languages`
-- -----------------------------------------------------
START TRANSACTION;
USE `help_ukr`;
INSERT INTO `help_ukr`.`languages` (`id`, `lang`) VALUES (1, 'eng');
INSERT INTO `help_ukr`.`languages` (`id`, `lang`) VALUES (2, 'ukr');
INSERT INTO `help_ukr`.`languages` (`id`, `lang`) VALUES (3, 'rus');

COMMIT;


-- -----------------------------------------------------
-- Data for table `help_ukr`.`countries`
-- -----------------------------------------------------
START TRANSACTION;
USE `help_ukr`;
INSERT INTO `help_ukr`.`countries` (`id`, `name`, `value`, `lang_id`) VALUES (1, 'default', 'default', 1);
INSERT INTO `help_ukr`.`countries` (`id`, `name`, `value`, `lang_id`) VALUES (1, 'default', 'default', 2);
INSERT INTO `help_ukr`.`countries` (`id`, `name`, `value`, `lang_id`) VALUES (1, 'default', 'default', 3);

COMMIT;


-- -----------------------------------------------------
-- Data for table `help_ukr`.`cities`
-- -----------------------------------------------------
START TRANSACTION;
USE `help_ukr`;
INSERT INTO `help_ukr`.`cities` (`id`, `name`, `value`, `country_id`, `lang_id`) VALUES (1, 'default', 'default', 1, 1);
INSERT INTO `help_ukr`.`cities` (`id`, `name`, `value`, `country_id`, `lang_id`) VALUES (1, 'default', 'default', 1, 2);
INSERT INTO `help_ukr`.`cities` (`id`, `name`, `value`, `country_id`, `lang_id`) VALUES (1, 'default', 'default', 1, 3);

COMMIT;


-- -----------------------------------------------------
-- Data for table `help_ukr`.`categories`
-- -----------------------------------------------------
START TRANSACTION;
USE `help_ukr`;
INSERT INTO `help_ukr`.`categories` (`id`, `name`, `value`, `city_id`, `lang_id`, `parent_id`) VALUES (1, 'default', 'default', 1, 1, NULL);
INSERT INTO `help_ukr`.`categories` (`id`, `name`, `value`, `city_id`, `lang_id`, `parent_id`) VALUES (1, 'default', 'default', 1, 2, NULL);
INSERT INTO `help_ukr`.`categories` (`id`, `name`, `value`, `city_id`, `lang_id`, `parent_id`) VALUES (1, 'default', 'default', 1, 3, NULL);

COMMIT;


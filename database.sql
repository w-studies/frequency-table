set names utf8mb4;

drop schema if exists frequency;
create schema frequency;
use frequency;

--
-- FREQUENCIES
--
create table frequencies
(
  id         int not null auto_increment primary key,
  student    varchar(191),
  frequency  JSON
) Engine = InnoDB;

# Learning and Q&A system

ALTER TABLE `wpqa`.`questions` 
CHANGE COLUMN `content` `content` TEXT NOT NULL ;

1. 自动推送
2. client禁用ajax
3. 制作sitemap
4. title很重要
5. 最主要的是先有受众
6. 

1. category 增加 description
ALTER TABLE `categories` 
ADD COLUMN `description` VARCHAR(100) NOT NULL DEFAULT '' AFTER `name`;

2. question 增加 description
ALTER TABLE `questions` 
ADD COLUMN `description` VARCHAR(100) NOT NULL DEFAULT '' AFTER `author`;

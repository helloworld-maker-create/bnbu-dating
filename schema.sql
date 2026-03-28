CREATE DATABASE IF NOT EXISTS `campus_matching` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `campus_matching`;

CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键自增',
    `edu_email` VARCHAR(128) NOT NULL COMMENT '校园邮箱（唯一）',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
    `status` VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_edu_email` (`edu_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户账号表';

CREATE TABLE IF NOT EXISTS `user_profile` (
    `user_id` BIGINT NOT NULL COMMENT '用户 ID，主键且关联 user.id',
    `nickname` VARCHAR(64) DEFAULT NULL COMMENT '昵称',
    `major` VARCHAR(128) DEFAULT NULL COMMENT '专业',
    `gpa_level` VARCHAR(64) DEFAULT NULL COMMENT 'GPA 区间，例如 Top 5%',
    `hobbies` TEXT DEFAULT NULL COMMENT '兴趣爱好，JSON 字符串',
    `goals` TEXT DEFAULT NULL COMMENT '阶段目标，JSON 字符串',
    `match_intent` VARCHAR(255) DEFAULT NULL COMMENT '匹配意向描述',
    PRIMARY KEY (`user_id`),
    CONSTRAINT `fk_user_profile_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户画像表';

CREATE TABLE IF NOT EXISTS `match_record` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键自增',
    `user_id1` BIGINT NOT NULL COMMENT '用户 1 ID',
    `user_id2` BIGINT NOT NULL COMMENT '用户 2 ID',
    `match_score` DECIMAL(5,2) NOT NULL COMMENT '匹配得分',
    `status` VARCHAR(32) NOT NULL DEFAULT 'PENDING' COMMENT '匹配状态，默认 PENDING',
    PRIMARY KEY (`id`),
    KEY `idx_match_user1` (`user_id1`),
    KEY `idx_match_user2` (`user_id2`),
    CONSTRAINT `fk_match_record_user1` FOREIGN KEY (`user_id1`) REFERENCES `user` (`id`),
    CONSTRAINT `fk_match_record_user2` FOREIGN KEY (`user_id2`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='匹配记录表';


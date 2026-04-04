package com.bnbu.match.service;

import com.bnbu.match.entity.User;

public interface UserService {

    /**
     * 注册用户
     *
     * @param eduEmail     校园邮箱
     * @param rawPassword  明文密码
     * @return 创建后的用户
     */
    User register(String eduEmail, String rawPassword);

    /**
     * 根据邮箱查询
     */
    User findByEduEmail(String eduEmail);

    /**
     * 验证密码
     */
    boolean verifyPassword(String rawPassword, String encodedPassword);
}


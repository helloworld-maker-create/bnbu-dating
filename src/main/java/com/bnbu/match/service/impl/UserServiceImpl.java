package com.bnbu.match.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.bnbu.match.entity.User;
import com.bnbu.match.entity.UserProfile;
import com.bnbu.match.mapper.UserMapper;
import com.bnbu.match.mapper.UserProfileMapper;
import com.bnbu.match.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserProfileMapper userProfileMapper;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final String HKBU_SUFFIX = "@life.hkbu.edu.hk";

    @Override
    @Transactional
    public User register(String eduEmail, String rawPassword) {
        if (!StringUtils.hasText(eduEmail) || !StringUtils.hasText(rawPassword)) {
            throw new IllegalArgumentException("邮箱和密码不能为空");
        }

        if (!isAllowedEduEmail(eduEmail)) {
            throw new IllegalArgumentException("邮箱后缀不被允许");
        }

        // 检查是否已存在
        User existing = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getEduEmail, eduEmail));
        if (existing != null) {
            throw new IllegalStateException("该邮箱已注册");
        }

        User user = new User();
        user.setEduEmail(eduEmail);
        user.setPasswordHash(hashPassword(rawPassword));
        user.setStatus("ACTIVE");
        userMapper.insert(user);

        // 初始化空的 UserProfile
        UserProfile profile = new UserProfile();
        profile.setUserId(user.getId());
        userProfileMapper.insert(profile);

        return user;
    }

    @Override
    public User findByEduEmail(String eduEmail) {
        if (!StringUtils.hasText(eduEmail)) {
            return null;
        }
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getEduEmail, eduEmail));
    }

    @Override
    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    private boolean isAllowedEduEmail(String eduEmail) {
        String lower = eduEmail.toLowerCase();
        // 允许 HKBU life 邮箱 或者其他 BNU 后缀（这里简单示例为 @bnu.edu.cn）
        return lower.endsWith(HKBU_SUFFIX) || lower.endsWith("@bnu.edu.cn");
    }

    private String hashPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}


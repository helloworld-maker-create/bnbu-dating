package com.bnbu.match.service;

import com.bnbu.match.entity.UserProfile;

import java.util.List;

public interface UserProfileService {

    /**
     * 初始化用户画像
     */
    void initProfile(Long userId);

    /**
     * 更新用户画像
     */
    UserProfile updateProfile(UserProfile profile);

    /**
     * 根据 userId 查询
     */
    UserProfile getByUserId(Long userId);

    /**
     * 获取所有用户画像
     */
    List<UserProfile> getAllProfiles();
}


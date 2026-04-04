package com.bnbu.match.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.bnbu.match.entity.UserProfile;
import com.bnbu.match.mapper.UserProfileMapper;
import com.bnbu.match.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileMapper userProfileMapper;

    @Override
    public void initProfile(Long userId) {
        UserProfile profile = new UserProfile();
        profile.setUserId(userId);
        userProfileMapper.insert(profile);
    }

    @Override
    @Transactional
    public UserProfile updateProfile(UserProfile profile) {
        if (profile.getUserId() == null) {
            throw new IllegalArgumentException("userId 不能为空");
        }
        UserProfile db = userProfileMapper.selectOne(new LambdaQueryWrapper<UserProfile>()
                .eq(UserProfile::getUserId, profile.getUserId()));
        if (db == null) {
            // 如果不存在则初始化一条
            userProfileMapper.insert(profile);
            return profile;
        }
        db.setNickname(profile.getNickname());
        db.setMajor(profile.getMajor());
        db.setGpaLevel(profile.getGpaLevel());
        db.setHobbies(profile.getHobbies());
        db.setGoals(profile.getGoals());
        db.setMatchIntent(profile.getMatchIntent());
        userProfileMapper.updateById(db);
        return db;
    }

    @Override
    public UserProfile getByUserId(Long userId) {
        return userProfileMapper.selectOne(new LambdaQueryWrapper<UserProfile>()
                .eq(UserProfile::getUserId, userId));
    }

    @Override
    public List<UserProfile> getAllProfiles() {
        return userProfileMapper.selectList(new LambdaQueryWrapper<>());
    }
}


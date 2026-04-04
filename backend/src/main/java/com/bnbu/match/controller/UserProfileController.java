package com.bnbu.match.controller;

import com.bnbu.match.common.Result;
import com.bnbu.match.entity.User;
import com.bnbu.match.entity.UserProfile;
import com.bnbu.match.service.UserProfileService;
import com.bnbu.match.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/profiles")
@Tag(name = "用户画像接口", description = "用户画像查询与更新接口")
@Validated
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final UserService userService;

    @PostMapping("/update")
    @Operation(summary = "更新用户画像", description = "更新昵称、专业、GPA 区间、兴趣爱好和目标等字段")
    public Result<UserProfile> updateProfile(@Validated @RequestBody UpdateProfileRequest request) {
        try {
            // 验证用户是否有权更新此档案
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getName())) {
                return Result.failure(401, "用户未认证");
            }

            // 获取当前登录用户
            User currentUser = userService.findByEduEmail(authentication.getName());
            if (currentUser == null) {
                return Result.failure(404, "用户不存在");
            }

            // 检查是否有权更新指定的用户资料
            if (!Objects.equals(currentUser.getId(), request.getUserId())) {
                return Result.failure(403, "无权更新他人资料");
            }

            UserProfile profile = new UserProfile();
            profile.setUserId(request.getUserId());
            profile.setNickname(request.getNickname());
            profile.setMajor(request.getMajor());
            profile.setGpaLevel(request.getGpaLevel());
            profile.setHobbies(request.getHobbies());
            profile.setGoals(request.getGoals());
            profile.setMatchIntent(request.getMatchIntent());

            UserProfile updated = userProfileService.updateProfile(profile);
            return Result.success("更新成功", updated);
        } catch (IllegalArgumentException e) {
            return Result.failure(400, e.getMessage());
        } catch (Exception e) {
            return Result.failure(500, "服务器内部错误");
        }
    }

    @GetMapping("/{userId}")
    @Operation(summary = "根据 userId 获取用户画像")
    public Result<UserProfile> getProfile(@PathVariable("userId") Long userId) {
        // 验证用户是否有权查看此档案
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
            "anonymousUser".equals(authentication.getName())) {
            return Result.failure(401, "用户未认证");
        }

        // 获取当前登录用户
        User currentUser = userService.findByEduEmail(authentication.getName());
        if (currentUser == null) {
            return Result.failure(404, "用户不存在");
        }

        // 检查是否是查看自己的资料
        if (!Objects.equals(currentUser.getId(), userId)) {
            return Result.failure(403, "无权查看他人资料");
        }

        UserProfile profile = userProfileService.getByUserId(userId);
        if (profile == null) {
            return Result.failure(404, "用户画像不存在");
        }
        return Result.success(profile);
    }

    @GetMapping("/all")
    @Operation(summary = "获取所有用户画像", description = "获取所有用户画像（用于推荐系统）")
    public Result<List<UserProfile>> getAllProfiles() {
        try {
            // 验证用户认证
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getName())) {
                return Result.failure(401, "用户未认证");
            }

            // 获取当前登录用户
            User currentUser = userService.findByEduEmail(authentication.getName());
            if (currentUser == null) {
                return Result.failure(404, "用户不存在");
            }

            List<UserProfile> profiles = userProfileService.getAllProfiles();
            return Result.success("获取成功", profiles);
        } catch (Exception e) {
            return Result.failure(500, "服务器内部错误");
        }
    }

    @Data
    public static class UpdateProfileRequest {

        @NotNull
        private Long userId;

        private String nickname;

        private String major;

        private String gpaLevel;

        /**
         * JSON 字符串，例如 '["吉他", "价值投资"]'
         */
        private String hobbies;

        /**
         * JSON 字符串，例如 '["准备直博", "MCM组队"]'
         */
        private String goals;

        private String matchIntent;
    }
}


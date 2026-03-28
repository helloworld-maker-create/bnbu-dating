package com.bnbu.match.controller;

import com.bnbu.match.common.Result;
import com.bnbu.match.dto.LoginRequest;
import com.bnbu.match.dto.LoginResponse;
import com.bnbu.match.entity.User;
import com.bnbu.match.entity.UserProfile;
import com.bnbu.match.service.UserService;
import com.bnbu.match.service.UserProfileService;
import com.bnbu.match.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@Tag(name = "用户接口", description = "用户注册、登录等接口")
@Validated
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserProfileService userProfileService;

    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "使用校园邮箱和密码注册新用户，仅支持 HKBU/BNU 后缀")
    public Result<User> register(@Validated @RequestBody RegisterRequest request) {
        try {
            User user = userService.register(request.getEduEmail(), request.getPassword());
            return Result.success("注册成功", user);
        } catch (IllegalArgumentException e) {
            return Result.failure(400, e.getMessage());
        } catch (IllegalStateException e) {
            return Result.failure(409, e.getMessage());
        } catch (Exception e) {
            return Result.failure(500, "服务器内部错误");
        }
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "使用邮箱和密码登录系统")
    public Result<LoginResponse> login(@Validated @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEduEmail(),
                            request.getPassword()
                    )
            );

            User user = userService.findByEduEmail(request.getEduEmail());
            if (user == null) {
                return Result.failure(404, "用户不存在");
            }

            String token = jwtUtil.generateTokenWithUserId(user.getEduEmail(), user.getId());
            LoginResponse response = new LoginResponse(token, user.getId(), user.getEduEmail());

            return Result.success("登录成功", response);
        } catch (Exception e) {
            return Result.failure(401, "邮箱或密码错误");
        }
    }

    @GetMapping("/me")
    @Operation(summary = "获取当前用户信息", description = "获取当前登录用户的详细信息")
    public Result<User> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                !"anonymousUser".equals(authentication.getName())) {

                User user = userService.findByEduEmail(authentication.getName());
                return Result.success(user);
            } else {
                return Result.failure(401, "用户未认证");
            }
        } catch (Exception e) {
            return Result.failure(500, "获取用户信息失败");
        }
    }

    @GetMapping("/recommendations")
    @Operation(summary = "获取推荐用户列表", description = "获取当前用户可能感兴趣的推荐用户列表")
    public Result<List<UserProfile>> getRecommendations() {
        try {
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

            // 获取所有用户画像
            List<UserProfile> allProfiles = userProfileService.getAllProfiles();

            // 过滤掉当前用户自己的资料
            List<UserProfile> recommendations = allProfiles.stream()
                .filter(profile -> !profile.getUserId().equals(currentUser.getId()))
                .collect(Collectors.toList());

            return Result.success("获取推荐成功", recommendations);
        } catch (Exception e) {
            return Result.failure(500, "获取推荐失败");
        }
    }

    @Data
    public static class RegisterRequest {

        @NotBlank
        @Email
        private String eduEmail;

        @NotBlank
        private String password;
    }
}


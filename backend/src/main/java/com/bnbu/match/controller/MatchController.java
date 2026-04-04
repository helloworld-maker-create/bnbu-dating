package com.bnbu.match.controller;

import com.bnbu.match.common.Result;
import com.bnbu.match.entity.MatchRecord;
import com.bnbu.match.entity.User;
import com.bnbu.match.service.MatchService;
import com.bnbu.match.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/matches")
@Tag(name = "匹配接口", description = "用户匹配生成接口（供定时任务或手动触发）")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;
    private final UserService userService;

    @PostMapping("/generate/{userId}")
    @Operation(summary = "为指定用户生成匹配结果", description = "基于规则打分生成匹配记录，写入 match_record 表，返回本次新生成的记录列表")
    public Result<List<MatchRecord>> generateMatches(@PathVariable("userId") Long userId) {
        try {
            // 验证用户是否有权为指定用户生成匹配
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

            // 检查是否有权为指定用户生成匹配
            if (!Objects.equals(currentUser.getId(), userId)) {
                return Result.failure(403, "无权为他人生成匹配");
            }

            List<MatchRecord> records = matchService.generateMatches(userId);
            return Result.success("生成成功", records);
        } catch (IllegalArgumentException e) {
            return Result.failure(400, e.getMessage());
        } catch (IllegalStateException e) {
            return Result.failure(404, e.getMessage());
        } catch (Exception e) {
            return Result.failure(500, "服务器内部错误");
        }
    }

    @GetMapping("")
    @Operation(summary = "获取当前用户的匹配记录", description = "获取当前登录用户的所有匹配记录")
    public Result<List<MatchRecord>> getMyMatches() {
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

            // 获取用户的匹配记录
            List<MatchRecord> records = matchService.getMatchesByUserId(currentUser.getId());
            return Result.success("获取成功", records);
        } catch (Exception e) {
            return Result.failure(500, "服务器内部错误");
        }
    }
}


package com.bnbu.match.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.bnbu.match.entity.MatchRecord;
import com.bnbu.match.entity.UserProfile;
import com.bnbu.match.mapper.MatchRecordMapper;
import com.bnbu.match.mapper.UserProfileMapper;
import com.bnbu.match.service.MatchService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final UserProfileMapper userProfileMapper;
    private final MatchRecordMapper matchRecordMapper;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public List<MatchRecord> generateMatches(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("userId 不能为空");
        }

        UserProfile source = userProfileMapper.selectOne(new LambdaQueryWrapper<UserProfile>()
                .eq(UserProfile::getUserId, userId));
        if (source == null) {
            throw new IllegalStateException("源用户画像不存在");
        }

        // 查询其他所有用户画像
        List<UserProfile> others = userProfileMapper.selectList(new LambdaQueryWrapper<UserProfile>()
                .ne(UserProfile::getUserId, userId));
        if (CollectionUtils.isEmpty(others)) {
            return Collections.emptyList();
        }

        // 为所有候选用户打分
        List<CandidateScore> scoredList = new ArrayList<>();
        for (UserProfile target : others) {
            BigDecimal score = calculateScore(source, target);
            if (score.compareTo(BigDecimal.ZERO) > 0) {
                scoredList.add(new CandidateScore(target.getUserId(), score));
            }
        }

        if (scoredList.isEmpty()) {
            return Collections.emptyList();
        }

        // 按得分从高到低排序，取前 3 名
        scoredList.sort(Comparator.comparing(CandidateScore::score).reversed());
        List<CandidateScore> top3 = scoredList.stream().limit(3).collect(Collectors.toList());

        List<MatchRecord> created = new ArrayList<>();
        for (CandidateScore cs : top3) {
            Long otherUserId = cs.userId();
            // 判断记录是否已存在（无论 userId1/userId2 顺序）
            Long smaller = Math.min(userId, otherUserId);
            Long larger = Math.max(userId, otherUserId);

            Long count = matchRecordMapper.selectCount(new LambdaQueryWrapper<MatchRecord>()
                    .eq(MatchRecord::getUserId1, smaller)
                    .eq(MatchRecord::getUserId2, larger));
            if (count != null && count > 0) {
                continue;
            }

            MatchRecord record = new MatchRecord();
            record.setUserId1(smaller);
            record.setUserId2(larger);
            record.setMatchScore(cs.score());
            record.setStatus("PENDING");
            matchRecordMapper.insert(record);
            created.add(record);
        }

        return created;
    }

    @Override
    public List<MatchRecord> getMatchesByUserId(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("userId 不能为空");
        }

        // 查询作为userId1或userId2的所有匹配记录
        List<MatchRecord> records = matchRecordMapper.selectList(
            new LambdaQueryWrapper<MatchRecord>()
                .eq(MatchRecord::getUserId1, userId)
                .or()
                .eq(MatchRecord::getUserId2, userId)
        );

        return records;
    }

    /**
     * 核心打分逻辑：
     * - 目标维度：goals 交集，每个 15 分，上限 45 分
     * - 兴趣维度：hobbies 交集，每个 10 分，上限 35 分
     * - 学术维度：gpaLevel 一致 10 分；major 一致 10 分
     */
    private BigDecimal calculateScore(UserProfile source, UserProfile target) {
        int total = 0;

        // 目标维度
        Set<String> goalsA = toNormalizedSet(source.getGoals());
        Set<String> goalsB = toNormalizedSet(target.getGoals());
        int goalIntersectionSize = intersectionSize(goalsA, goalsB);
        total += Math.min(goalIntersectionSize * 15, 45);

        // 兴趣维度
        Set<String> hobbiesA = toNormalizedSet(source.getHobbies());
        Set<String> hobbiesB = toNormalizedSet(target.getHobbies());
        int hobbyIntersectionSize = intersectionSize(hobbiesA, hobbiesB);
        total += Math.min(hobbyIntersectionSize * 10, 35);

        // 学术维度
        if (StringUtils.hasText(source.getGpaLevel()) && source.getGpaLevel().equals(target.getGpaLevel())) {
            total += 10;
        }
        if (StringUtils.hasText(source.getMajor()) && source.getMajor().equals(target.getMajor())) {
            total += 10;
        }

        if (total <= 0) {
            return BigDecimal.ZERO;
        }
        if (total > 100) {
            total = 100;
        }
        return BigDecimal.valueOf(total);
    }

    private Set<String> toNormalizedSet(String jsonArrayString) {
        if (!StringUtils.hasText(jsonArrayString)) {
            return Collections.emptySet();
        }
        try {
            List<String> list = objectMapper.readValue(jsonArrayString, new TypeReference<List<String>>() {
            });
            if (list == null) {
                return Collections.emptySet();
            }
            return list.stream()
                    .filter(StringUtils::hasText)
                    .map(s -> s.trim().toLowerCase())
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            // 解析失败时视为无标签，避免影响整体流程
            return Collections.emptySet();
        }
    }

    private int intersectionSize(Set<String> a, Set<String> b) {
        if (CollectionUtils.isEmpty(a) || CollectionUtils.isEmpty(b)) {
            return 0;
        }
        Set<String> copy = new HashSet<>(a);
        copy.retainAll(b);
        return copy.size();
    }

    private record CandidateScore(Long userId, BigDecimal score) {
    }
}


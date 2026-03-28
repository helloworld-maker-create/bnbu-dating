package com.bnbu.match.service;

import com.bnbu.match.entity.MatchRecord;

import java.util.List;

public interface MatchService {

    /**
     * 为指定用户生成匹配结果（按规则打分并写入 match_record）
     *
     * @param userId 源用户 ID
     * @return 新生成的匹配记录列表（按得分从高到低）
     */
    List<MatchRecord> generateMatches(Long userId);

    /**
     * 获取指定用户的匹配记录
     *
     * @param userId 用户 ID
     * @return 匹配记录列表
     */
    List<MatchRecord> getMatchesByUserId(Long userId);
}


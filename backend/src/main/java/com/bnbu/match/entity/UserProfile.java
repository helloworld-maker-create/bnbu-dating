package com.bnbu.match.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("user_profile")
public class UserProfile {

    @TableId
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


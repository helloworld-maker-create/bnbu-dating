package com.bnbu.match.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private Long userId;
    private String eduEmail;

    public LoginResponse(String token, Long userId, String eduEmail) {
        this.token = token;
        this.userId = userId;
        this.eduEmail = eduEmail;
    }
}
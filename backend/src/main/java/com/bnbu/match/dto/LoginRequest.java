package com.bnbu.match.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String eduEmail;
    private String password;
}
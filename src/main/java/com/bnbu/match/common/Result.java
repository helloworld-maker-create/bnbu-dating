package com.bnbu.match.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {

    private Integer code;

    private String message;

    private T data;

    public static <T> Result<T> success(T data) {
        return new Result<>(0, "success", data);
    }

    public static <T> Result<T> success(String message, T data) {
        return new Result<>(0, message, data);
    }

    public static <T> Result<T> failure(Integer code, String message) {
        return new Result<>(code, message, null);
    }

    public static <T> Result<T> failure(String message) {
        return new Result<>(-1, message, null);
    }
}


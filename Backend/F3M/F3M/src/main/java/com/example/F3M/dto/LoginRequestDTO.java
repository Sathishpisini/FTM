package com.example.F3M.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {

    private String emailOrPhone;
    private String password;
}
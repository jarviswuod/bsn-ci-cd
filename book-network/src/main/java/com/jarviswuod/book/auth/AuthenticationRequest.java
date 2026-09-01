package com.jarviswuod.book.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthenticationRequest(

        @Email(message = "Email is not well formatted")
        @NotBlank(message = "Email is mandatory")
        String email,

        @Size(min = 4, message = "Password should be at least 4 characters long")
        @NotBlank(message = "Password is mandatory")
        String password
) {
}
package com.jarviswuod.book.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(

        @NotBlank(message = "FirstName is mandatory")
        String firstName,

        @NotBlank(message = "LastName is mandatory")
        String lastName,

        @Email(message = "Email is not well formatted")
        @NotBlank(message = "Email is mandatory")
        String email,

        @Size(min = 4, message = "Password should be at least 4 characters long")
        @NotBlank(message = "Password is mandatory")
        String password
) {
}

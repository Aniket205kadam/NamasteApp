package com.aniketkadam.namaste_app.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticationRequest {

    @NotEmpty(message = "Please provide your email address to proceed!")
    @NotBlank(message = "Please provide your email address to proceed!")
    private String email;
    @NotEmpty(message = "Please enter your password to continue!")
    @NotBlank(message = "Please enter your password to continue!")
    private String password;
}

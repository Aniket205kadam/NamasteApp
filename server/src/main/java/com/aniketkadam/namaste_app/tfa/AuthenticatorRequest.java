package com.aniketkadam.namaste_app.tfa;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticatorRequest {
    @NotEmpty(message = "Please provide your secrete to proceed!")
    @NotBlank(message = "Please provide your secrete to proceed!")
    private String secrete;
    @NotEmpty(message = "Please provide your time-based one time password to proceed!")
    @NotBlank(message = "Please provide your time-based one time password to proceed!")
    private String otp;
}

package com.aniketkadam.namaste_app.email;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TfaAuthenticationRequest {
    private String to;
    private String otp;
    private String subject;
}

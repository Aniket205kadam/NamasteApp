package com.aniketkadam.namaste_app.auth;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationResponse {
    private String token;
    private LocalDateTime createAt;
    private LocalDateTime expiredAt;
}

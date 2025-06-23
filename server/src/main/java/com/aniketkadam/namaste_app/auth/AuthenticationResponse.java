package com.aniketkadam.namaste_app.auth;

import com.aniketkadam.namaste_app.tfa.TFAType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationResponse {
    private String token;
    private String fullName;
    private String id;
    private boolean isTfaEnabled;
    private TFAType type;
}

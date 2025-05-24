package com.aniketkadam.namaste_app.auth;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuthResponse {
    private String id;
    private String fullName;
    private String email;
    private Boolean isAuthenticated;
    private String authToken;
    private String avtar;
}

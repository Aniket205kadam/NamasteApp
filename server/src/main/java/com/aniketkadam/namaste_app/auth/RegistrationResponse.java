package com.aniketkadam.namaste_app.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegistrationResponse {
    private String id;
    private String jwtToken;
    private String fullName;
    private String secreteImageUri;
}

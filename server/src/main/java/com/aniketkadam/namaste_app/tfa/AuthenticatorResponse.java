package com.aniketkadam.namaste_app.tfa;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticatorResponse {
    private String secrete;
    private String qrCodeImage;
}

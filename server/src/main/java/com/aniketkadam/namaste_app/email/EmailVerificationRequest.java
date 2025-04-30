package com.aniketkadam.namaste_app.email;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailVerificationRequest {
    private String to;
    private MailTemplateName mailTemplate;
    private String verificationUrl;
    private String verificationCode;
    private String subject;
}

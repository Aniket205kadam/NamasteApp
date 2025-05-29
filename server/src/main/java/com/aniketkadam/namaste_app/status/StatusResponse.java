package com.aniketkadam.namaste_app.status;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatusResponse {
    private String id;
    private String userId;
    private String mediaUrl;
    private StatusType type;
    private String caption;
    private String text;
    private String bgColor;
    private LocalDateTime createdAt;
}

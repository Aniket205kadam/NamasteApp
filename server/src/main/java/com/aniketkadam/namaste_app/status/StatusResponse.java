package com.aniketkadam.namaste_app.status;

import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserResponse;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatusResponse {
    private String id;
    private UserResponse user;
    private String mediaUrl;
    private StatusType type;
    private String caption;
    private String text;
    private String bgColor;
    private LocalDateTime createdAt;
    private boolean isSeen;
}

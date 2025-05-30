package com.aniketkadam.namaste_app.status;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusPreviewResponse {
    private String id;
    private String name;
    private String preview;
    private LocalDateTime createdAt;
    private boolean isSeen;
}

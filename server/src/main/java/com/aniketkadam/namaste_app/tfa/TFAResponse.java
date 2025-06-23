package com.aniketkadam.namaste_app.tfa;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TFAResponse {
    private boolean isTfaEnabled;
    private TFAType type;
}

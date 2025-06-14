package com.aniketkadam.namaste_app.tfa;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TFARequest {
    @NotEmpty(message = "UserId is mandatory")
    @NotBlank(message = "UserId is mandatory")
    private String userId;
    @NotEmpty(message = "Code is mandatory")
    @NotBlank(message = "Code is mandatory")
    private String code;
    @NotEmpty(message = "Password is mandatory")
    @NotBlank(message = "Password is mandatory")
    private String password;
}

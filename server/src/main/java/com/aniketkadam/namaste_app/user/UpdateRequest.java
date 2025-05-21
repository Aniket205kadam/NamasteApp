package com.aniketkadam.namaste_app.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRequest {
    @NotBlank(message = "Name cannot be blank.")
    @NotEmpty(message = "Name cannot be empty.")
    private String name;
    @NotBlank(message = "About cannot be blank.")
    @NotEmpty(message = "About cannot be empty.")
    private String about;
}

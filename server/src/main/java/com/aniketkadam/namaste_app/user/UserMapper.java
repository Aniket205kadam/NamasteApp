package com.aniketkadam.namaste_app.user;

import com.aniketkadam.namaste_app.file.FileUtils;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class UserMapper {
    private String getFileExtension(@NonNull String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    public UserResponse toUserResponse(User user) {
        String avtar = null;
        if (user.getAvtar() != null && !(user.getAvtar().startsWith("https"))) {
            avtar = "data:image/"
                    + getFileExtension(user.getAvtar())
                    + ";base64,"
                    + Base64.getEncoder().encodeToString(FileUtils.readFileFromDestination(user.getAvtar()));
        }
        if (user.getAvtar() != null && user.getAvtar().startsWith("https")) {
            avtar = user.getAvtar();
        }
        return UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .lastSeen(user.getLastSeen())
                .avtar(avtar)
                .isOnline(user.isUserOnline())
                .about(user.getAbout())
                .build();
    }
}

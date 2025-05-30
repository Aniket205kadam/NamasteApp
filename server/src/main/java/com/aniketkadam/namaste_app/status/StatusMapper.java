package com.aniketkadam.namaste_app.status;

import com.aniketkadam.namaste_app.file.FileUtils;
import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
@RequiredArgsConstructor
public class StatusMapper {
    private final UserMapper userMapper;

    private String getFileExtension(@NonNull String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    public StatusResponse toStatusResponse(Status status, User connectedUser) {
        String media = null;
        if (status.getMediaUrl() != null) {
            media = "data:"
                    + (status.getType() == StatusType.IMAGE ? "image" : "video")
                    + "/"
                    + getFileExtension(status.getMediaUrl())
                    + ";base64,"
                    + Base64.getEncoder().encodeToString(FileUtils.readFileFromDestination(status.getMediaUrl()));
        }
        boolean isSeen = status.getViewerIds()
                .stream()
                .anyMatch(id -> id.equals(connectedUser.getId()));
        return StatusResponse.builder()
                .id(status.getId())
                .user(userMapper.toUserResponse(status.getUser()))
                .mediaUrl(media)
                .type(status.getType())
                .caption(status.getCaption())
                .text(status.getText())
                .bgColor(status.getBgColor())
                .createdAt(status.getCreatedDate())
                .isSeen(isSeen)
                .build();
    }
}

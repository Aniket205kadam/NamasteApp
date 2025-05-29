package com.aniketkadam.namaste_app.status;

import com.aniketkadam.namaste_app.file.FileUtils;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class StatusMapper {

    private String getFileExtension(@NonNull String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    public StatusResponse toStatusResponse(Status status) {
        String media = null;
        if (status.getMediaUrl() != null) {
            media = "data:"
                    + (status.getType() == StatusType.IMAGE ? "image" : "video")
                    + "/"
                    + getFileExtension(status.getMediaUrl())
                    + ";base64,"
                    + Base64.getEncoder().encodeToString(FileUtils.readFileFromDestination(status.getMediaUrl()));
        }
        return StatusResponse.builder()
                .id(status.getId())
                .userId(status.getUser().getId())
                .mediaUrl(media)
                .type(status.getType())
                .caption(status.getCaption())
                .text(status.getText())
                .bgColor(status.getBgColor())
                .createdAt(status.getCreatedDate())
                .build();
    }
}

package com.aniketkadam.namaste_app.file;

import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@Slf4j
@NoArgsConstructor
public class FileUtils {

    public static byte[] readFileFromDestination(String fileUrl) {
        if (!StringUtils.hasText(fileUrl)) {
            return new byte[0];
        }
        try {
            Path filePath = Paths.get(fileUrl);
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            log.warn("No file found in this path: {}", fileUrl);
        }
        return new byte[0];
    }
}

package com.aniketkadam.namaste_app.file;

import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

import static java.io.File.separator;

@Service
@Slf4j
public class FileService {

    @Value("${application.file.uploads.media-output-path}")
    private String fileUploadPath;

    @Value("${application.file.uploads.avtar-output-path}")
    private String avtarUploadPath;

    @Value("${application.file.uploads.status-output-path}")
    private String statusUploadPath;

    public String saveFile(
            @NonNull MultipartFile sourceFile,
            @NonNull String userId
    ) {
        final String fileUploadSubPath = "users" + separator + userId;
        return uploadFile(sourceFile, fileUploadSubPath);
    }

    public String uploadStatus(
            @NonNull MultipartFile sourceFile,
            @NonNull String userId
    ) throws OperationNotPermittedException {
        final String finalUploadPath = statusUploadPath + separator + userId;
        File targetFolder = new File(finalUploadPath);
        if (!targetFolder.exists()) {
            boolean folderCreated = targetFolder.mkdirs();
            if (!folderCreated) {
                log.warn("Failed to create the status folder: {}", targetFolder);
                return null;
            }
        }
        final String fileExtension = getFileExtension(sourceFile.getOriginalFilename());
        String targetFilePath = finalUploadPath + separator + System.currentTimeMillis() + "." + fileExtension;

        Path targetPath = Paths.get(targetFilePath);
        try {
            Files.write(targetPath, sourceFile.getBytes());
            log.info("Status saved to: {}", targetFilePath);
            return targetFilePath;
        } catch (IOException e) {
            log.error("Failed to save the status: {}", targetFilePath);
            throw new OperationNotPermittedException("Failed to save the status photo or video");
        }
    }

    public String uploadAvtar(
            @NonNull MultipartFile sourceFile,
            @NonNull String userId
    ) {
        final String finalUploadPath = avtarUploadPath;
        File targetFolder = new File(finalUploadPath);
        if (!targetFolder.exists()) {
            boolean folderCreated = targetFolder.mkdirs();
            if (!folderCreated) {
                log.warn("Failed to create the required folder: {}", targetFolder);
                return null;
            }
        }
        final String fileExtension = getFileExtension(sourceFile.getOriginalFilename());
        String targetFilePath = finalUploadPath + separator + userId + "." + fileExtension;
        Path targetPath = Paths.get(targetFilePath);
        try {
            Files.write(targetPath, sourceFile.getBytes());
            log.info("Avtar saved to: {}", targetFilePath);
            return targetFilePath;
        } catch (IOException e) {
            log.error("Avtar was not saved", e);
        }
        return null;
    }

    private String uploadFile(
            @NonNull MultipartFile sourceFile,
            @NonNull String fileUploadSubPath
    ) {
        final String finalUploadPath = fileUploadPath + separator + fileUploadSubPath;
        File targetFolder = new File(finalUploadPath);
        if (!targetFolder.exists()) {
            boolean folderCreated = targetFolder.mkdirs();
            if (!folderCreated) {
                log.warn("Failed to create the target folder: {}", targetFolder);
                return null;
            }
        }
        final String fileExtension = getFileExtension(sourceFile.getOriginalFilename());
        String targetFilePath = finalUploadPath + separator + System.currentTimeMillis() + "." + fileExtension;
        Path targetPath = Paths.get(targetFilePath);
        try {
            Files.write(targetPath, sourceFile.getBytes());
            log.info("File saved to: {}", targetFilePath);
            return targetFilePath;
        } catch (IOException e) {
            log.error("File was not saved", e);
        }
        return null;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }
        int lastDotIdx = fileName.lastIndexOf(".");
        if (lastDotIdx == -1) {
            return "";
        }
        return fileName.substring(lastDotIdx + 1).toLowerCase();
    }

    public String generateThumbnail(String videoUrl, String statusId) {
        try {
            Files.createDirectories(Paths.get("./thumbnail"));
            String targetPath = "./thumbnail/" + statusId + ".png";
            // first check thumbnail is already exist or not
            if (Files.exists(Paths.get(targetPath))) {
                return targetPath;
            }
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "ffmpeg",
                    "-y",
                    "-i", videoUrl,
                    "-ss", "00:00:05",
                    "-vframes", "1",
                    targetPath
            );
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            if (!process.waitFor(30, TimeUnit.SECONDS)) {
                process.destroy();
                throw new OperationNotPermittedException("Failed to create video thumbnail!");
            }
            return targetPath;
        } catch (IOException | InterruptedException | OperationNotPermittedException e) {
            System.out.println("Failed to generate thumbnail!");
        }
        return null;
    }

    public String getEncodedImage(String mediaUrl) {
        return "data:image/"
                + getFileExtension(mediaUrl)
                + ";base64,"
                + Base64.getEncoder().encodeToString(FileUtils.readFileFromDestination(mediaUrl));
    }
}

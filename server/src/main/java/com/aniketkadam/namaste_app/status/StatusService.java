package com.aniketkadam.namaste_app.status;

import com.aniketkadam.namaste_app.chat.Chat;
import com.aniketkadam.namaste_app.chat.ChatRepository;
import com.aniketkadam.namaste_app.chat.ChatResponse;
import com.aniketkadam.namaste_app.chat.ChatService;
import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import com.aniketkadam.namaste_app.file.FileService;
import com.aniketkadam.namaste_app.file.FileUtils;
import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserMapper;
import com.aniketkadam.namaste_app.user.UserRepository;
import com.aniketkadam.namaste_app.user.UserResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class StatusService {
    private static final Logger log = LoggerFactory.getLogger(StatusService.class);
    private final StatusRepository repository;
    private final FileService fileService;
    private final ChatService chatService;
    private final ChatRepository chatRepository;
    private final UserMapper userMapper;
    private final StatusMapper statusMapper;
    private final UserRepository userRepository;

    @Transactional
    public String createStatusWithFile(String caption, MultipartFile file, Authentication connectedUser) throws OperationNotPermittedException {
        User user = (User) connectedUser.getPrincipal();
        final String filePath = fileService.uploadStatus(file, user.getId());
        Status status = Status.builder()
                .user(user)
                .mediaUrl(filePath)
                .type(getStatusType(file))
                .caption(caption)
                .expiresAt(LocalDateTime.now().plusHours(24)) // status display for 24 hours
                .visibilityList(getStatusVisiblilityList(connectedUser))
                .build();
        Status savedStatus = repository.save(status);
        return savedStatus.getId();
    }

    private List<String> getStatusVisiblilityList(Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        // User status only watch this user they are chat before with this user
        List<ChatResponse> chats = chatService.getChatsByUser(connectedUser);
        Set<String> visibilityList = new HashSet<>();

        chats.forEach(chat -> {
            Optional<Chat> c = chatRepository.findById(chat.getId());
            if (c.isPresent()) {
                User targetUser = c.get().getTargetUser(user.getId());
                visibilityList.add(targetUser.getId());
            } else {
                log.warn("We are failed to add the User with chat ID: {}", chat.getId());
            }
        });
        return visibilityList.stream().toList();
    }

    @Transactional
    public String createStatusWithText(
            @NonNull String text,
            @NonNull String bgColor,
            @NonNull String textStyle,
            @NonNull Authentication connectedUser
    ) {
        User user = (User) connectedUser.getPrincipal();
        Status status = Status.builder()
                .user(user)
                .type(StatusType.TEXT)
                .text(text)
                .bgColor(bgColor) // set the background color
                .textStyle(textStyle) // set the text style (font-family)
                .expiresAt(LocalDateTime.now().plusHours(24)) // status display for 24 hours
                .visibilityList(getStatusVisiblilityList(connectedUser))
                .build();
        Status savedStatus = repository.save(status);
        return savedStatus.getId();
    }

    private StatusType getStatusType(@NonNull MultipartFile file) throws OperationNotPermittedException {
        final String contentType = file.getContentType();
        assert contentType != null;
        if (contentType.startsWith("image/")) {
            return StatusType.IMAGE;
        } else if (contentType.startsWith("video/")) {
            return StatusType.VIDEO;
        } else {
            throw new OperationNotPermittedException("You can only images and video upload in the status");
        }
    }

    public List<StatusPreviewResponse> findStatusForUser(Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Set<User> statusUser = new HashSet<>();
        List<Status> status = repository.findStatusesVisibleToUser(user.getId());
        status.forEach(s -> {
            statusUser.add(s.getUser());
        });
        List<StatusPreviewResponse> statusPreviews = statusUser.stream()
                .map(u ->
                        {
                            List<Status> uStatus = repository.findStatusesByUser(u.getId());
                            Optional<Status> latestStatus = uStatus
                                    .stream()
                                    .max(Comparator.comparing(Status::getCreatedDate));
                            if (latestStatus.isEmpty()) {
                                return null;
                            }
                            String preview = null;
                            if (latestStatus.get().getType() == StatusType.IMAGE) {
                                preview = statusMapper.toStatusResponse(latestStatus.get(), user).getMediaUrl();
                            } else if (latestStatus.get().getType() == StatusType.VIDEO) {
                                String targetThumbnail = fileService.generateThumbnail(latestStatus.get().getMediaUrl(), latestStatus.get().getId());
                                preview = fileService.getEncodedImage(targetThumbnail);
                            }
                            boolean isSeen = uStatus.stream()
                                    .allMatch(us -> us.getViewerIds().contains(user.getId()));
                            return StatusPreviewResponse.builder()
                                    .id(u.getId())
                                    .name(u.getName())
                                    .preview(preview)
                                    .createdAt(latestStatus.get().getCreatedDate())
                                    .isSeen(isSeen)
                                    .build();
                        }
                )
                .toList();
        return statusPreviews;
    }

    @Transactional
    public void viewStatus(
            @NonNull String statusId,
            @NonNull Authentication connectedUser
    ) throws OperationNotPermittedException {
        User user = (User) connectedUser.getPrincipal();
        Status status = repository.findById(statusId)
                .orElseThrow(() -> new EntityNotFoundException("Status with ID: " + statusId + " not found"));
        if (user.getId().equals(status.getUser().getId())) {
            log.warn("Status owner not view there own status!");
            return;
        }
        boolean isCurrentWatchStatus = status.getVisibilityList()
                .stream()
                .anyMatch(id -> id.equals(user.getId()));
        if (!isCurrentWatchStatus) {
            throw new OperationNotPermittedException("You don't have to access to watch this status!");
        }
        status.getViewerIds().add(user.getId());
        repository.save(status);
    }

    public List<UserResponse> getViewersOfStatus(String statusId, Authentication connectedUser) throws OperationNotPermittedException {
        User user = (User) connectedUser.getPrincipal();
        Status status = repository.findById(statusId)
                .orElseThrow(() -> new EntityNotFoundException("Status with ID: " + statusId + " not found"));
        // only status owner watch the status viewers
        if (!user.getId().equals(status.getUser().getId())) {
            throw new OperationNotPermittedException("You don't have the permission to watch the status viewers");
        }
        return status.getViewerIds()
                .stream()
                .map(id -> {
                    User viewerUser = userRepository.findById(id)
                            .orElseThrow(() -> new EntityNotFoundException("User with Id: " + id + " not found"));
                    return userMapper.toUserResponse(viewerUser);
                })
                .toList();
    }

    @Transactional
    public void deleteStatus(String statusId, Authentication connectedUser) throws OperationNotPermittedException {
        User user = (User) connectedUser.getPrincipal();
        Status status = repository.findById(statusId)
                .orElseThrow(() -> new EntityNotFoundException("Status with ID: " + statusId + " not found"));
        // Only Status owner can delete the status
        if (!user.getId().equals(status.getUser().getId())) {
            throw new EntityNotFoundException("You don't have the permission to delete the status");
        }
        // delete media if exists
        if (status.getType() == StatusType.IMAGE || status.getType() == StatusType.VIDEO) {
            deleteStatusMedia(status.getMediaUrl());
        }
        repository.deleteById(status.getId());
        log.info("Successfully delete the status: {}", status.getId());
    }

    private void deleteStatusMedia(@NonNull String mediaUrl) throws OperationNotPermittedException {
        try {
            Files.delete(Paths.get(mediaUrl));
            log.info("Successfully delete the status media: {}", mediaUrl);
        } catch (IOException e) {
            log.error("Failed to delete the status media: {}", mediaUrl);
            throw new OperationNotPermittedException("Failed to delete the status media: " + mediaUrl);
        }
    }

    public List<StatusResponse> getMyStatuses(Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        List<Status> statuses = repository.findStatusesByUser(user.getId());
        return statuses.stream()
                .filter(s -> s.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(status -> statusMapper.toStatusResponse(status, user))
                .toList();
    }

    public Boolean connectedUserHasStatus(Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        return repository.findUserHasStatus(user.getId());
    }

    @Transactional
    public void removeExpiredStatus() {
        List<Status> expiredStatus = repository.findExpiredStatus();
        expiredStatus.forEach(status -> {
            if (status.getType() == StatusType.TEXT) {
                repository.deleteById(status.getId());
            } else {
                String mediaUrl = status.getMediaUrl();
                try {
                    Files.delete(Paths.get(mediaUrl));
                } catch (IOException e) {
                    log.error("Failed to delete the status media, url: {}", mediaUrl);
                }
                repository.deleteById(status.getId());
            }
        });
    }

    public List<StatusResponse> findStatusByUser(String userId, Authentication connectedUser) throws OperationNotPermittedException {
        User user = (User) connectedUser.getPrincipal();
        List<Status> statues = repository.findStatusesByUser(userId);
        // if user present in the visibility list then watch the status
        if (!statues.getFirst().getUser().getId().equals(user.getId()) && statues.getFirst()
                .getVisibilityList()
                .stream()
                .noneMatch(id -> id.equals(user.getId()))
        ) {
            throw new OperationNotPermittedException("You don't have to permission to watch this user status!");
        }
        return statues.stream()
                .map(s -> statusMapper.toStatusResponse(s, user))
                .toList();
    }
}

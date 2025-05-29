package com.aniketkadam.namaste_app.status;

import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import com.aniketkadam.namaste_app.user.UserResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/status")
@RequiredArgsConstructor
@Tag(name = "Status")
public class StatusController {
    private final StatusService service;

    @PostMapping(value = "/upload-media", consumes = "multipart/form-data")
    public ResponseEntity<String> setStatusWithFile(
            @RequestParam(value = "caption", required = false) String caption,
            @RequestPart("file") MultipartFile file,
            Authentication connectedUser
    ) throws OperationNotPermittedException {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.createStatusWithFile(caption, file, connectedUser));
    }

    @PostMapping("/text")
    public ResponseEntity<String> setStatusWithText(
            @RequestParam("text") String text,
            @RequestParam("bgColor") String bgColor,
            Authentication connectedUser
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.createStatusWithText(text, bgColor, connectedUser));
    }

    @GetMapping
    public ResponseEntity<List<StatusResponse>> getStatesForUser(
            Authentication connectedUser
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.findStatusForUser(connectedUser));
    }

    @PatchMapping("/v/{status-id}")
    @ResponseStatus(HttpStatus.OK)
    public void viewStatus(
            @PathVariable("status-id") String statusId,
            Authentication connectedUser
    ) throws OperationNotPermittedException {
        service.viewStatus(statusId, connectedUser);
    }

    @GetMapping("/viewers/{status-id}")
    public ResponseEntity<List<UserResponse>> getViewers(
            @PathVariable("status-id") String statusId,
            Authentication connectedUser
    ) throws OperationNotPermittedException {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.getViewersOfStatus(statusId, connectedUser));
    }

    @DeleteMapping("/d/{status-id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteStatus(
            @PathVariable("status-id") String statusId,
            Authentication connectedUser
    ) throws OperationNotPermittedException {
        service.deleteStatus(statusId, connectedUser);
    }
}

package com.aniketkadam.namaste_app.user;

import com.aniketkadam.namaste_app.chat.ChatResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User")
public class UserController {
    private final UserService service;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUser(
            Authentication connectedUser
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.findAllUsersExceptsSelf(connectedUser));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(
            @RequestParam("query") String query,
            Authentication connectedUser
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.searchUsers(query, connectedUser));
    }

    @GetMapping("/u/{user-id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable("user-id") String userId
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.findUserById(userId));
    }

    @PutMapping("/update")
    public ResponseEntity<UserResponse> updateUser(
            @RequestBody UpdateRequest request,
            Authentication connectedUser
    ) {
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(service.updateUserInfo(request, connectedUser));
    }

    @PostMapping("/avtar")
    public ResponseEntity<UserResponse> uploadAvtar(
            Authentication connectedUser,
            @RequestPart("avtar") MultipartFile avtar
    ) {
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(service.uploadAvtar(avtar, connectedUser));
    }

    @PatchMapping("/avtar/remove")
    @ResponseStatus(HttpStatus.OK)
    public void removeAvtar(
            Authentication connectedUser
    ) throws IOException {
        service.removeAvtar(connectedUser);
    }
}

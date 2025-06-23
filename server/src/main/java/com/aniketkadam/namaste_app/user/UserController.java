package com.aniketkadam.namaste_app.user;

import com.aniketkadam.namaste_app.chat.ChatResponse;
import com.aniketkadam.namaste_app.exception.WrongOtpException;
import com.aniketkadam.namaste_app.tfa.AuthenticatorRequest;
import com.aniketkadam.namaste_app.tfa.AuthenticatorResponse;
import com.aniketkadam.namaste_app.tfa.TFAResponse;
import dev.samstevens.totp.exceptions.QrGenerationException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
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

    @GetMapping("/get/authenticator/secrete")
    public ResponseEntity<AuthenticatorResponse> generateAuthenticatorSecrete(
            Authentication connectedUser
    ) throws QrGenerationException {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.generateAuthenticatorSecrete(connectedUser));
    }

    @PutMapping("/enable/two-factor-authentication/authenticator/app")
    @ResponseStatus(HttpStatus.OK)
    public void set2FAUsingAuthenticatorApp(
            @RequestBody @Valid AuthenticatorRequest request,
            Authentication connectedUser
    ) throws WrongOtpException {
        service.set2FAUsingAuthenticatorApp(request, connectedUser);
    }

    @GetMapping("/send/2fa/register-email")
    @ResponseStatus(HttpStatus.OK)
    public void generateOtpForEmail(
            Authentication connectedUser
    ) throws MessagingException {
     service.generateOtpForEmail(connectedUser);
    }

    @PutMapping("/enable/two-factor-authentication/register-email/{otp}")
    @ResponseStatus(HttpStatus.OK)
    public void set2FAUsingRegisterEmail(
            @PathVariable("otp") String otp,
            Authentication connectedUser
    ) throws WrongOtpException {
        service.set2FAUsingRegisterEmail(otp, connectedUser);
    }

    @GetMapping("/is/enable/2fa")
    public ResponseEntity<TFAResponse> isEnable2fa(
            Authentication connectedUser
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.isEnable2fa(connectedUser));
    }

    @PatchMapping("/turn-off/2fa")
    @ResponseStatus(HttpStatus.OK)
    public void turnOff2fa(
            Authentication connectedUser
    ) {
        service.turnOff2fa(connectedUser);
    }
}

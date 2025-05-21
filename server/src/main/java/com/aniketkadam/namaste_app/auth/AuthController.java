package com.aniketkadam.namaste_app.auth;

import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {
    private final AuthService service;

    @PostMapping("/signup")
    public ResponseEntity<String> register(
            @RequestBody @Valid RegistrationRequest request
    ) throws MessagingException {
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(service.register(request));
    }

    @PatchMapping("/verification/{email}/{verification-code}")
    @ResponseStatus(HttpStatus.OK)
    public void emailVerification(
            @PathVariable("email") String email,
            @PathVariable("verification-code") String otp
    ) throws Exception {
        service.emailVerification(otp, email);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody @Valid AuthenticationRequest request
    ) throws OperationNotPermittedException {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.login(request));
    }

    @GetMapping("/resend/{email}/otp")
    @ResponseStatus(HttpStatus.OK)
    public void resendOtp(
            @PathVariable("email") String email
    ) throws MessagingException {
        service.sendOtp(email);
    }
}

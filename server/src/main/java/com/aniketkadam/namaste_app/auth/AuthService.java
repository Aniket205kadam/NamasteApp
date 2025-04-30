package com.aniketkadam.namaste_app.auth;

import com.aniketkadam.namaste_app.email.EmailService;
import com.aniketkadam.namaste_app.email.EmailVerificationRequest;
import com.aniketkadam.namaste_app.email.MailTemplateName;
import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import com.aniketkadam.namaste_app.security.JwtService;
import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserRepository;
import com.aniketkadam.namaste_app.user.VerificationCode;
import com.aniketkadam.namaste_app.user.VerificationCodeRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;


    public void register(RegistrationRequest request) throws MessagingException {
        User user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);
        sendValidationToken(user);
    }

    private void sendValidationToken(User user) throws MessagingException {
        String newToken = generateAndSaveActivationToken(user);
        // send email
        emailService.sendEmail(EmailVerificationRequest.builder()
                        .to(user.getEmail())
                        .mailTemplate(MailTemplateName.ACTIVATE_ACCOUNT)
                        .verificationUrl("") // todo -> remove after sometime version
                        .verificationCode(newToken)
                        .subject("Account activation")
                        .build()
        );
    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken = generateActivationToken(6);
        VerificationCode verificationCode = VerificationCode.builder()
                .code(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(2)) // generated verification code only valid for 2 minutes
                .user(user)
                .build();
        return verificationCodeRepository.save(verificationCode).getCode();
    }

    private String generateActivationToken(int length) {
        String characters = "0123456789";
        StringBuilder code = new StringBuilder();
        SecureRandom random = new SecureRandom();
        for (int i = 0; i < length; i++) {
            int randomIdx = random.nextInt(characters.length());
            code.append(characters.charAt(randomIdx));
        }
        return code.toString();
    }

    public void emailVerification(String otp, String email) throws OperationNotPermittedException, MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User is not found with email: " + email));
        VerificationCode verificationCode = verificationCodeRepository.findByUserAndCode(user.getId(), otp)
                .orElseThrow(() -> new EntityNotFoundException("Verification code is not found with code and user!"));
        if (verificationCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            sendValidationToken(user);
            throw new OperationNotPermittedException("Verification code expired! We've sent a new one to your email. Please check your inbox.");
        }
        if (verificationCode.getValidatedAt() != null) {
            throw new OperationNotPermittedException("A new token has been sent! The previous one is already validated.");
        }
        user.setVerified(true);
        userRepository.save(user);

        verificationCode.setValidatedAt(LocalDateTime.now());
        verificationCodeRepository.save(verificationCode);
    }

    public AuthenticationResponse login(AuthenticationRequest request) throws OperationNotPermittedException {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User is not found with email: " + request.getEmail()));
        if (!user.isVerified()) {
            throw new OperationNotPermittedException("Access Denied! Your account is not verified. Please complete verification first!");
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );
        String jwtToken = jwtService.generateJwtToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .createAt(LocalDateTime.now())
                .expiredAt(null) // todo -> also set the expired time
                .build();
    }
}

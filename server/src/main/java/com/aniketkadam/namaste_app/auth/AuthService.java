package com.aniketkadam.namaste_app.auth;

import com.aniketkadam.namaste_app.email.EmailService;
import com.aniketkadam.namaste_app.email.EmailVerificationRequest;
import com.aniketkadam.namaste_app.email.MailTemplateName;
import com.aniketkadam.namaste_app.email.TfaAuthenticationRequest;
import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import com.aniketkadam.namaste_app.exception.WrongOtpException;
import com.aniketkadam.namaste_app.security.JwtService;
import com.aniketkadam.namaste_app.tfa.*;
import com.aniketkadam.namaste_app.user.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    private final TOTPService totpService;
    private final TfaEmailTokenRepository tfaEmailTokenRepository;

    @Transactional
    public String register(RegistrationRequest request) throws MessagingException, QrGenerationException {
        User user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .about("Hey there! I am using NamasteApp")
                .build();
        User savedUser = userRepository.save(user);
        sendValidationToken(user);
        return savedUser.getId();
    }

    private void sendValidationToken(User user) throws MessagingException {
        String newToken = generateAndSaveActivationToken(user);
        // send email
        emailService.sendEmail(
                EmailVerificationRequest.builder()
                        .to(user.getEmail())
                        .mailTemplate(MailTemplateName.ACTIVATE_ACCOUNT)
                        .verificationUrl("")
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

    @Transactional
    public RegistrationResponse emailVerification(String otp, String email) throws OperationNotPermittedException, MessagingException, QrGenerationException {
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

        return RegistrationResponse.builder()
                .id(user.getId())
                .fullName(user.getName())
                .build();
    }

    public AuthenticationResponse login(AuthenticationRequest request) throws OperationNotPermittedException, MessagingException {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User is not found with email: " + request.getEmail()));
        if (!user.isVerified()) {
            throw new OperationNotPermittedException("Access Denied! Your account is not verified. Please complete verification first!");
        }
        // first check the email and password is correct then show 2fa
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword()));
        if (user.isTfaEnabled()) {
            // if user use email 2-factor authentication then its executed
            if (user.getType() == TFAType.REGISTERED_EMAIL) {
                // send login code on email
                String otp = generateActivationToken(6);
                TfaEmailToken tfaEmailToken = TfaEmailToken.builder()
                        .otp(otp)
                        .createdAt(LocalDateTime.now())
                        .expiresAt(LocalDateTime.now().plusMinutes(10))
                        .user(user)
                        .build();
                tfaEmailTokenRepository.save(tfaEmailToken);
                TfaAuthenticationRequest emailRequest = TfaAuthenticationRequest.builder()
                        .to(user.getEmail())
                        .otp(otp)
                        .subject("")
                        .build();
                emailService.send2FAOTP(emailRequest);
            }
            return AuthenticationResponse.builder()
                    .fullName(user.getName())
                    .id(user.getId())
                    .type(user.getType())
                    .isTfaEnabled(true)
                    .build();
        } else {
            Map<String, Object> claims = new HashMap<>();
            claims.put("email", user.getEmail());
            String jwtToken = jwtService.generateJwtToken(claims, user);
            return AuthenticationResponse.builder()
                    .isTfaEnabled(false)
                    .token(jwtToken)
                    .fullName(user.getName())
                    .id(user.getId())
                    .build();
        }
    }

    public void sendOtp(@NonNull String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User with email: " + email + " not found"));
        sendValidationToken(user);
    }

    public AuthenticationResponse verifiedAuthenticatorCode(TFARequest request) throws WrongOtpException {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User with Id: " + request.getUserId() + " not found!"));
        // If user use registered email for 2-factor authentication then execute this block
        if (user.getType() == TFAType.REGISTERED_EMAIL) {
            TfaEmailToken tfaEmailToken = tfaEmailTokenRepository.findByUserAndOtp(user.getId(), request.getCode())
                    .orElseThrow(() -> new EntityNotFoundException("2FA token with user Id : " + user.getId() + " not found"));
            if (tfaEmailToken.getExpiresAt().isBefore(LocalDateTime.now())) {
                throw new WrongOtpException("The OTP you entered has expired. Please request a new OTP and try again.");
            }
            if (tfaEmailToken.getValidatedAt() != null) {
                throw new WrongOtpException("A new OTP has been sent! The previous one is already validated.");
            }
            Map<String, Object> claims = new HashMap<>();
            claims.put("email", user.getEmail());
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
            );
            String jwtToken = jwtService.generateJwtToken(claims, user);
            return AuthenticationResponse.builder()
                    .id(user.getId())
                    .fullName(user.getName())
                    .token(jwtToken)
                    .build();
        }

        if (!totpService.isOtpValid(user.getTOTPSecrete(), request.getCode())) {
            throw new WrongOtpException("WRONG OTP");
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );
        String jwtToken = jwtService.generateJwtToken(claims, user);
        return AuthenticationResponse.builder()
                .id(user.getId())
                .fullName(user.getName())
                .token(jwtToken)
                .build();
    }
}

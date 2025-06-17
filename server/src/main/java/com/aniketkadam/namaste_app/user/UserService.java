package com.aniketkadam.namaste_app.user;

import com.aniketkadam.namaste_app.email.EmailService;
import com.aniketkadam.namaste_app.email.EmailVerificationRequest;
import com.aniketkadam.namaste_app.email.MailTemplateName;
import com.aniketkadam.namaste_app.email.TfaAuthenticationRequest;
import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import com.aniketkadam.namaste_app.exception.WrongOtpException;
import com.aniketkadam.namaste_app.file.FileService;
import com.aniketkadam.namaste_app.tfa.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import jakarta.mail.MessagingException;
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
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final UserMapper mapper;
    private final FileService fileService;
    private final TOTPService totpService;
    private final TfaEmailTokenRepository tfaEmailTokenRepository;
    private final EmailService emailService;

    public List<UserResponse> findAllUsersExceptsSelf(Authentication connectedUser) {
        return userRepository.findAllUsersExceptSelf(((User) connectedUser.getPrincipal()).getId())
                .stream()
                .map(mapper::toUserResponse)
                .toList();
    }

    public List<UserResponse> searchUsers(String query, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        return userRepository.searchUsers(query)
                .stream()
                .filter(u -> !u.getId().equals(user.getId()))
                .map(mapper::toUserResponse)
                .toList();
    }

    public UserResponse findUserById(@NonNull String userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with Id: " + userId + " not found!"));
        return mapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateUserInfo(UpdateRequest request, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        String[] name = request.getName().split(" ");
        String firstname = "";
        String lastname = "";
        if (name.length == 2) {
            firstname = name[0];
            lastname = name[1];
        } else {
            firstname = name[0];
            lastname = "";
        }
        user.setFirstname(firstname);
        user.setLastname(lastname);
        user.setAbout(request.getAbout());
        User savedUser = userRepository.save(user);
        return mapper.toUserResponse(savedUser);
    }

    @Transactional
    public UserResponse uploadAvtar(MultipartFile avtar, Authentication connectedUser) {
        var user = (User) connectedUser.getPrincipal();
        String avtarPath = fileService.uploadAvtar(avtar, user.getId());
        user.setAvtar(avtarPath);
        var savedUser = userRepository.save(user);
        return mapper.toUserResponse(savedUser);
    }

    @Transactional
    public void removeAvtar(Authentication connectedUser) throws IOException {
        var user = (User) connectedUser.getPrincipal();
        Files.delete(Paths.get(user.getAvtar()));
        log.info("Remove the avtar of user: {}", user.getFirstname() + " " + user.getLastname());
        user.setAvtar(null);
        userRepository.save(user);
    }

    public AuthenticatorResponse generateAuthenticatorSecrete(Authentication connectedUser) throws QrGenerationException {
        User user = (User) connectedUser.getPrincipal();
        String secrete = totpService.generateNewSecret();
        String qrCodeImage = totpService.generateQrCodeImageUri(secrete, user.getName());
        return AuthenticatorResponse.builder()
                .secrete(secrete)
                .qrCodeImage(qrCodeImage)
                .build();
    }

    @Transactional
    public void set2FAUsingAuthenticatorApp(AuthenticatorRequest request, Authentication connectedUser) throws WrongOtpException {
        User user = (User) connectedUser.getPrincipal();
        boolean isOtpValid = totpService.isOtpValid(request.getSecrete(), request.getOtp());
        if (!isOtpValid) {
            throw new WrongOtpException("Invalid one-time password. Please try again.");
        }
        user.setTfaEnabled(true);
        user.setTOTPSecrete(request.getSecrete());
        user.setType(TFAType.AUTHENTICATOR_APP);
        userRepository.save(user);
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
    public void generateOtpForEmail(Authentication connectedUser) throws MessagingException {
        User user = (User) connectedUser.getPrincipal();
        String otp = generateActivationToken(6);
        TfaEmailToken tfaEmailToken = TfaEmailToken.builder()
                .otp(otp)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .user(user)
                .build();
        tfaEmailTokenRepository.save(tfaEmailToken);
        TfaAuthenticationRequest request = TfaAuthenticationRequest.builder()
                .to(user.getEmail())
                .otp(otp)
                .subject("")
                .build();
        emailService.send2FAOTP(request);
    }

    public void set2FAUsingRegisterEmail(String otp, Authentication connectedUser) throws WrongOtpException {
        User user = (User) connectedUser.getPrincipal();
        TfaEmailToken token = tfaEmailTokenRepository.findByUserAndOtp(user.getId(), otp)
                .orElseThrow(() -> new EntityNotFoundException("2FA token with user Id : " + user.getId() + " not found"));
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new WrongOtpException("The OTP you entered has expired. Please request a new OTP and try again.");
        }
        if (token.getValidatedAt() != null) {
            throw new WrongOtpException("A new OTP has been sent! The previous one is already validated.");
        }
        user.setType(TFAType.REGISTERED_EMAIL);
        token.setValidatedAt(LocalDateTime.now());
        userRepository.save(user);
        tfaEmailTokenRepository.save(token);
    }
}

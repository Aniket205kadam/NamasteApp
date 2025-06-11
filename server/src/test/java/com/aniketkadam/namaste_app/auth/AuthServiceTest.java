package com.aniketkadam.namaste_app.auth;

import com.aniketkadam.namaste_app.email.EmailService;
import com.aniketkadam.namaste_app.email.EmailVerificationRequest;
import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import com.aniketkadam.namaste_app.security.JwtService;
import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserRepository;
import com.aniketkadam.namaste_app.user.VerificationCode;
import com.aniketkadam.namaste_app.user.VerificationCodeRepository;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;
    @Mock
    private VerificationCodeRepository verificationCodeRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtService jwtService;
    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void registerTest() throws MessagingException {
        RegistrationRequest request = RegistrationRequest.builder()
                .firstname("Aniket")
                .lastname("Kadam")
                .email("aniket@gmail.com")
                .password("plaintext")
                .build();
        String encodedPassword = "encodedPassword";
        when(passwordEncoder.encode("plaintext")).thenReturn(encodedPassword);

        String userId = String.valueOf(UUID.randomUUID());
        User savedUser = User.builder()
                .id(userId)
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(encodedPassword)
                .about("Hey there! I am using NamasteApp")
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        VerificationCode otp = VerificationCode.builder()
                .code("123456")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(2))
                .user(savedUser)
                .build();

        when(verificationCodeRepository.save(any(VerificationCode.class))).thenReturn(otp);

        String savedUserId = authService.register(request);

        assertEquals(savedUserId, userId);
        verify(passwordEncoder, times(1)).encode(any(String.class));
        verify(userRepository, times(1)).save(any(User.class));
        verify(verificationCodeRepository, times(1)).save(any(VerificationCode.class));
        verify(emailService, times(1)).sendEmail(any(EmailVerificationRequest.class));
    }

    @Test
    public void emailVerificationTest() throws MessagingException, OperationNotPermittedException {
        String otp = "123456";
        String email = "aniket@gmail.com";
        String userId = String.valueOf(UUID.randomUUID());

        User user = User.builder()
                .id(userId)
                .firstname("aniket")
                .lastname("kadam")
                .email("aniket@gmail.com")
                .password("encodedPassword")
                .build();

        VerificationCode verificationCode = VerificationCode.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .code("123456")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(2))
                .user(user)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(verificationCodeRepository.findByUserAndCode(user.getId(), otp)).thenReturn(Optional.of(verificationCode));
        when(verificationCodeRepository.save(any(VerificationCode.class))).thenReturn(verificationCode);
        when(userRepository.save(user)).thenReturn(user);

        authService.emailVerification(otp, email);

        assertTrue(user.isVerified());
        assertNotNull(verificationCode.getValidatedAt());
    }

    @Test
    public void loginTest() throws OperationNotPermittedException {
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("aniket@gmail.com")
                .password("encodedPassword")
                .build();
        User user = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .email("aniket@gmail.com")
                .password("encodedPassword")
                .firstname("aniket")
                .lastname("kadam")
                .isVerified(true)
                .build();

        when(userRepository.findByEmail("aniket@gmail.com")).thenReturn(Optional.of(user));

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);

        String jwt = "mocked.jwt.token";
        when(jwtService.generateJwtToken(anyMap(), eq(user))).thenReturn(jwt);

        AuthenticationResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals(jwt, response.getToken());
        assertEquals(user.getName(), response.getFullName());
        assertEquals(user.getId(), response.getId());
    }

    @Test
    public void sendOtpTest() throws MessagingException {
        String email = "aniket@gmail.com";
        User user = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .email("aniket@gmail.com")
                .password("encodedPassword")
                .firstname("aniket")
                .lastname("kadam")
                .isVerified(true)
                .build();
        VerificationCode verificationCode = VerificationCode.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .code("123456")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(2))
                .user(user)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(verificationCodeRepository.save(any(VerificationCode.class))).thenReturn(verificationCode);

        authService.sendOtp(email);

        verify(userRepository, times(1)).findByEmail(email);
        verify(verificationCodeRepository, times(1)).save(any(VerificationCode.class));
    }
}
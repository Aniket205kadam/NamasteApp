package com.aniketkadam.namaste_app.auth;

import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import com.aniketkadam.namaste_app.handler.ExceptionResponse;
import com.aniketkadam.namaste_app.security.JwtService;
import com.aniketkadam.namaste_app.tfa.TFARequest;
import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import dev.samstevens.totp.exceptions.QrGenerationException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {
    private final AuthService service;
    private final JwtService jwtService;
    private final RestTemplate restTemplate;
    private final UserRepository userRepository;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.github.client-id}")
    private String githubClientId;

    @Value("${spring.security.oauth2.client.registration.github.client-secret}")
    private String githubSecret;

    @PostMapping("/signup")
    public ResponseEntity<String> register(
            @RequestBody @Valid RegistrationRequest request
    ) throws MessagingException, QrGenerationException {
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(service.register(request));
    }

    @PatchMapping("/verification/{email}/{verification-code}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<RegistrationResponse> emailVerification(
            @PathVariable("email") String email,
            @PathVariable("verification-code") String otp,
            @RequestParam("password") String password
    ) throws Exception {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.emailVerification(otp, email, password));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody @Valid AuthenticationRequest request
    ) throws OperationNotPermittedException {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.login(request));
    }

    @PostMapping("/two-factor-authentication")
    public ResponseEntity<AuthenticationResponse> tfa(
            @RequestBody @Valid TFARequest request
            ) throws OperationNotPermittedException {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.tfaVerification(request));
    }

    @GetMapping("/resend/{email}/otp")
    @ResponseStatus(HttpStatus.OK)
    public void resendOtp(
            @PathVariable("email") String email
    ) throws MessagingException {
        service.sendOtp(email);
    }

    @PostMapping("/github")
    public ResponseEntity<?> githubLogin(
            @RequestBody Map<String, String> payload
    ) {
        String code = payload.get("code");
        String tokenUrl = "https://github.com/login/oauth/access_token";
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", githubClientId);
        body.add("client_secret", githubSecret);
        body.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        String accessToken = (String) response.getBody().get("access_token");
        if (accessToken == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Github login failed");
        }

        HttpHeaders authHeaders = new HttpHeaders();
        authHeaders.setBearerAuth(accessToken);
        HttpEntity<Void> userRequest = new HttpEntity<>(authHeaders);

        ResponseEntity<Map> githubUserResponse = restTemplate.exchange(
                "https://api.github.com/user",
                HttpMethod.GET,
                userRequest,
                Map.class
        );

        Map<String, Object> userData = githubUserResponse.getBody();
        User user = processGithubUser(userData);
        Map<String, Object> claims = Map.of("email", user.getEmail());

        String jwtToken = jwtService.generateJwtToken(claims, user);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(OAuthResponse.builder()
                        .id(user.getId())
                        .fullName(user.getName())
                        .email(user.getEmail())
                        .isAuthenticated(true)
                        .avtar(user.getAvtar())
                        .authToken(jwtToken)
                        .build()
                );
    }

    private User processGithubUser(Map<String, Object> userData) {
        String sub = String.valueOf(userData.get("id"));
        Optional<User> existingUser = userRepository.findBySub(sub);
        if (existingUser.isPresent()) return existingUser.get();

        String[] fullName = ((String) userData.get("name")).split(" ");

        String firstname = "";
        String lastname = "";
        if (fullName.length == 2) {
            firstname = fullName[0];
            lastname = fullName[1];
        } else {
            firstname = fullName[0];
            lastname = "";
        }

        User newUser = new User();
        newUser.setSub(sub);
        newUser.setEmail((String) userData.get("email"));
        newUser.setFirstname(firstname);
        newUser.setLastname(lastname);
        newUser.setVerified(true);
        newUser.setAvtar((String) userData.get("avatar_url"));
        newUser.setAbout("Hey there! I am using NamasteApp");
        return userRepository.save(newUser);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(
            @RequestBody Map<String, String> payload
    ) throws GeneralSecurityException, IOException {
        String token = payload.get("token");
        GoogleIdToken idToken = verifyToken(token);
        if (idToken != null) {
            GoogleIdToken.Payload googleUser = idToken.getPayload();
            User user = processUser(googleUser);
            Map<String, Object> claims = new HashMap<>();
            claims.put("email", user.getEmail());
            String jwtToken = jwtService.generateJwtToken(claims, user);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(OAuthResponse.builder()
                            .id(user.getId())
                            .fullName(user.getName())
                            .email(user.getEmail())
                            .isAuthenticated(true)
                            .avtar(user.getAvtar())
                            .authToken(jwtToken)
                            .build()
                    );
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ExceptionResponse.builder()
                        .message("Invalid token")
                        .build()
                );
    }

    private GoogleIdToken verifyToken(String token) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                JacksonFactory.getDefaultInstance()
        )
                .setAudience(Collections.singletonList(clientId))
                .build();
        return verifier.verify(token);
    }

    private User processUser(GoogleIdToken.Payload googleUser) {
        String sub = googleUser.getSubject();
        Optional<User> existingUser = userRepository.findBySub(sub);
        if (existingUser.isPresent()) return existingUser.get();

        String[] fullName = ((String) googleUser.get("name")).split(" ");

        String firstname = "";
        String lastname = "";
        if (fullName.length == 2) {
            firstname = fullName[0];
            lastname = fullName[1];
        } else {
            firstname = fullName[0];
            lastname = "";
        }

        User newUser = new User();
        newUser.setSub(sub);
        newUser.setEmail(googleUser.getEmail());
        newUser.setFirstname(firstname.trim());
        newUser.setLastname(lastname.trim());
        newUser.setVerified(true);
        newUser.setAvtar((String) googleUser.get("picture"));
        newUser.setAbout("Hey there! I am using NamasteApp");
        return userRepository.save(newUser);
    }
}

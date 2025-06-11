package com.aniketkadam.namaste_app.user;

import com.aniketkadam.namaste_app.file.FileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {
    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserMapper mapper;
    @Mock
    private FileService fileService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findAllUsersExceptsSelf() {
        User connectedUser = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .firstname("firstname")
                .lastname("lastname")
                .email("test@gmail.com")
                .build();
        User user1 = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .build();
        User user2 = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .build();
        User user3 = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .build();

        List<User> users = List.of(user1, user2, user3);

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(connectedUser);
        when(userRepository.findAllUsersExceptSelf(connectedUser.getId())).thenReturn(users);
        for (User u : users) {
            when(mapper.toUserResponse(u)).thenReturn(UserResponse.builder().id(u.getId()).build());
        }

        List<UserResponse> results = userService.findAllUsersExceptsSelf(authentication);
        assertEquals(results.size(), users.size());
        verify(userRepository, times(1)).findAllUsersExceptSelf(connectedUser.getId());
        verify(mapper, times(users.size())).toUserResponse(any(User.class));
    }

    @Test
    void searchUsersTest() {
        User connectedUser = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .firstname("firstname")
                .lastname("lastname")
                .email("test@gmail.com")
                .build();
        User user1 = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .firstname("a")
                .build();
        User user2 = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .firstname("ab")
                .build();
        User user3 = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .firstname("c")
                .build();

        List<User> users = List.of(connectedUser, user1, user2, user3);

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(connectedUser);
        when(userRepository.searchUsers("first")).thenReturn(List.of(connectedUser));
        when(userRepository.searchUsers("a")).thenReturn(List.of(user1, user2));

        List<UserResponse> searchedUsers1 = userService.searchUsers("first", authentication);
        List<UserResponse> searchedUsers2 = userService.searchUsers("a", authentication);

        assertEquals(0, searchedUsers1.size());
        assertEquals(2, searchedUsers2.size());
        verify(authentication, times(2)).getPrincipal();
        verify(userRepository, times(2)).searchUsers(anyString());
    }

    @Test
    void findUserByIdTest() {
        String userId = "userId123";
        User user = User.builder()
                .id(userId)
                .firstname("firstname")
                .lastname("lastname")
                .email("test@gmail.com")
                .build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(mapper.toUserResponse(user)).thenReturn(UserResponse.builder()
                        .id(userId)
                        .firstname(user.getFirstname())
                        .lastname(user.getLastname())
                        .email(user.getEmail())
                .build()
        );
        UserResponse userResponse = userService.findUserById(userId);
        assertEquals(userResponse.getId(), user.getId());
        verify(userRepository, times(1)).findById(userId);
        verify(mapper, times(1)).toUserResponse(user);
    }

    @Test
    void updateUserInfoTest() {
        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .firstname("firstname")
                .lastname("lastname")
                .email("test@gmail.com")
                .build();

        UpdateRequest request = UpdateRequest.builder()
                .name("Aniket Kadam")
                .about("I never lose; I either won or learn;")
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(user);

        // Mock after user gets updated
        User updatedUser = User.builder()
                .id(user.getId())
                .firstname("Aniket")
                .lastname("Kadam")
                .email(user.getEmail())
                .about("I never lose; I either won or learn;")
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id(updatedUser.getId())
                .firstname(updatedUser.getFirstname())
                .lastname(updatedUser.getLastname())
                .email(updatedUser.getEmail())
                .about(updatedUser.getAbout())
                .build();

        when(userRepository.save(any(User.class))).thenReturn(updatedUser);
        when(mapper.toUserResponse(any(User.class))).thenReturn(userResponse);

        UserResponse result = userService.updateUserInfo(request, authentication);

        assertNotNull(result);
        assertEquals("Aniket", result.getFirstname());
        assertEquals("Kadam", result.getLastname());
        assertEquals("I never lose; I either won or learn;", result.getAbout());

        verify(userRepository, times(1)).save(any(User.class));
        verify(mapper, times(1)).toUserResponse(any(User.class));
    }


    @Test
    void uploadAvtar() {
        String avtarPath = "/media/avtar.png";
        User user = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .firstname("firstname")
                .lastname("lastname")
                .email("test@gmail.com")
                .password("encrypted-password")
                .avtar(avtarPath)
                .build();
        Authentication authentication = mock(Authentication.class);
        MultipartFile avtar = mock(MultipartFile.class);
        User savedUser = User.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .password(user.getPassword())
                .avtar(avtarPath)
                .build();


        when(authentication.getPrincipal()).thenReturn(user);
        when(fileService.uploadAvtar(avtar, user.getId())).thenReturn(avtarPath);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(mapper.toUserResponse(any(User.class))).thenReturn(
                UserResponse.builder()
                        .id(user.getId())
                        .firstname(user.getFirstname())
                        .lastname(user.getLastname())
                        .email(user.getEmail())
                        .avtar(user.getAvtar())
                        .build()
        );
        UserResponse result = userService.uploadAvtar(avtar, authentication);

        assertEquals(user.getId(), result.getId());
        assertEquals(user.getFirstname(), result.getFirstname());
        assertEquals(user.getLastname(), result.getLastname());
        assertEquals(user.getEmail(), result.getEmail());
        assertEquals(user.getAvtar(), result.getAvtar());
        verify(userRepository, times(1)).save(any(User.class));
        verify(fileService, times(1)).uploadAvtar(avtar, user.getId());
        verify(mapper, times(1)).toUserResponse(any(User.class));
    }

    @Test
    void removeAvtar() {
        String avtarPath = "/media/avtar.png";
        User user = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .firstname("firstname")
                .lastname("lastname")
                .email("test@gmail.com")
                .avtar(avtarPath)
                .build();
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(user);

        try (MockedStatic<Files> mockedStatic = mockStatic(Files.class)) {
            userService.removeAvtar(authentication);
            mockedStatic.verify(() -> Files.delete(Paths.get(avtarPath)), times(1));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        assertNull(user.getAvtar());
        verify(userRepository, times(1)).save(user);
    }
}
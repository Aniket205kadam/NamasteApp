package com.aniketkadam.namaste_app.status;

import com.aniketkadam.namaste_app.chat.ChatRepository;
import com.aniketkadam.namaste_app.chat.ChatService;
import com.aniketkadam.namaste_app.file.FileService;
import com.aniketkadam.namaste_app.user.UserMapper;
import com.aniketkadam.namaste_app.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;

class StatusServiceTest {
    @InjectMocks
    private StatusService service;

    @Mock
    private StatusRepository repository;
    @Mock
    private FileService fileService;
    @Mock
    private ChatService chatService;
    @Mock
    private ChatRepository chatRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private StatusMapper statusMapper;
    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createStatusWithFile() {

    }

    @Test
    void createStatusWithText() {
    }

    @Test
    void findStatusForUser() {
    }

    @Test
    void viewStatus() {
    }

    @Test
    void getViewersOfStatus() {
    }

    @Test
    void deleteStatus() {
    }

    @Test
    void getMyStatuses() {
    }

    @Test
    void connectedUserHasStatus() {
    }

    @Test
    void removeExpiredStatus() {
    }

    @Test
    void findStatusByUser() {
    }
}
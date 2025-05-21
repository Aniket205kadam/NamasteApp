package com.aniketkadam.namaste_app.user;

import com.aniketkadam.namaste_app.file.FileService;
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
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final UserMapper mapper;
    private final FileService fileService;

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
}

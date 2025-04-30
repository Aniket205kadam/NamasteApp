package com.aniketkadam.namaste_app.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper mapper;

    public List<UserResponse> findAllUsersExceptsSelf(Authentication connectedUser) {
        return userRepository.findAllUsersExceptSelf(((User) connectedUser.getPrincipal()).getId())
                .stream()
                .map(mapper::toUserResponse)
                .toList();
    }
}

package com.aniketkadam.namaste_app.security;

import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = repository
                .findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User is not found with email: + " + email)
                );
        user.setLastSeen(LocalDateTime.now());
        repository.save(user);
        return user;
    }
}

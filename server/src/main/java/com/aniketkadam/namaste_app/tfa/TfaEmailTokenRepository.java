package com.aniketkadam.namaste_app.tfa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TfaEmailTokenRepository extends JpaRepository<TfaEmailToken, String> {

    @Query("SELECT token FROM TfaEmailToken token WHERE token.user.id = :userId AND token.otp = :otp")
    Optional<TfaEmailToken> findByUserAndOtp(@Param("userId") String userId, @Param("otp") String otp);
}

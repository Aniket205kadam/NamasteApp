package com.aniketkadam.namaste_app.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, String> {

    @Query("""
            SELECT code
            FROM VerificationCode code
            WHERE code.code = :otp
            AND code.user.id = :userId
            """)
    Optional<VerificationCode> findByUserAndCode(String userId, String otp);
}

package com.circlehub.repository;

import com.circlehub.model.RefreshToken;
import com.circlehub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    
    Optional<RefreshToken> findByUser(User user);
    
    @Modifying
    void deleteByUser(User user);
    
    @Modifying
    void deleteByExpiryDateBefore(LocalDateTime date);
}

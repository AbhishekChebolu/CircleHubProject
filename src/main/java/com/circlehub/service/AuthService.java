package com.circlehub.service;

import com.circlehub.dto.AuthResponse;
import com.circlehub.dto.LoginRequest;
import com.circlehub.dto.RegisterRequest;
import com.circlehub.model.User;
import com.circlehub.model.RefreshToken;
import com.circlehub.repository.UserRepository;
import com.circlehub.repository.RefreshTokenRepository;
import com.circlehub.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user = userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getEmail());
        String refreshToken = createRefreshToken(user);
        
        return new AuthResponse(token, refreshToken, user.getId(), user.getName(), user.getEmail());
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtUtil.generateToken(user.getEmail());
        String refreshToken = createRefreshToken(user);
        
        return new AuthResponse(token, refreshToken, user.getId(), user.getName(), user.getEmail());
    }
    
    public AuthResponse refreshAccessToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        
        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException("Refresh token expired");
        }
        
        User user = refreshToken.getUser();
        String newAccessToken = jwtUtil.generateToken(user.getEmail());
        
        return new AuthResponse(newAccessToken, refreshTokenValue, user.getId(), user.getName(), user.getEmail());
    }
    
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue)
                .ifPresent(refreshTokenRepository::delete);
    }
    
    private String createRefreshToken(User user) {
        // Delete old refresh tokens for this user
        refreshTokenRepository.deleteByUser(user);
        
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken = refreshTokenRepository.save(refreshToken);
        
        return refreshToken.getToken();
    }
}

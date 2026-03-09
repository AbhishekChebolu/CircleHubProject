package com.circlehub.service;

import com.circlehub.model.User;
import com.circlehub.model.UserFollow;
import com.circlehub.repository.UserFollowRepository;
import com.circlehub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {
    
    @Autowired
    private UserFollowRepository userFollowRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Transactional
    public void followUser(Long userIdToFollow) {
        User currentUser = userService.getCurrentUser();
        User userToFollow = userRepository.findById(userIdToFollow)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (currentUser.getId().equals(userIdToFollow)) {
            throw new RuntimeException("Cannot follow yourself");
        }
        
        if (userFollowRepository.existsByFollowerAndFollowing(currentUser, userToFollow)) {
            throw new RuntimeException("Already following this user");
        }
        
        UserFollow userFollow = new UserFollow();
        userFollow.setFollower(currentUser);
        userFollow.setFollowing(userToFollow);
        userFollowRepository.save(userFollow);
        
        // Create notification
        notificationService.notifyFollow(userToFollow, currentUser);
    }
    
    @Transactional
    public void unfollowUser(Long userIdToUnfollow) {
        User currentUser = userService.getCurrentUser();
        User userToUnfollow = userRepository.findById(userIdToUnfollow)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserFollow userFollow = userFollowRepository.findByFollowerAndFollowing(currentUser, userToUnfollow)
                .orElseThrow(() -> new RuntimeException("Not following this user"));
        
        userFollowRepository.delete(userFollow);
    }
    
    public boolean isFollowing(Long userId) {
        User currentUser = userService.getCurrentUser();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userFollowRepository.existsByFollowerAndFollowing(currentUser, user);
    }
    
    public List<User> getFollowers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userFollowRepository.findByFollowing(user)
                .stream()
                .map(UserFollow::getFollower)
                .collect(Collectors.toList());
    }
    
    public List<User> getFollowing(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userFollowRepository.findByFollower(user)
                .stream()
                .map(UserFollow::getFollowing)
                .collect(Collectors.toList());
    }
    
    public Long getFollowerCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userFollowRepository.countFollowers(user);
    }
    
    public Long getFollowingCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userFollowRepository.countFollowing(user);
    }
}

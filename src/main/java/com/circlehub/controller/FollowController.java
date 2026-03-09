package com.circlehub.controller;

import com.circlehub.dto.ApiResponse;
import com.circlehub.dto.UserDTO;
import com.circlehub.model.User;
import com.circlehub.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class FollowController {
    
    @Autowired
    private FollowService followService;
    
    @PostMapping("/{userId}/follow")
    public ResponseEntity<ApiResponse> followUser(@PathVariable Long userId) {
        followService.followUser(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Successfully followed user"));
    }
    
    @DeleteMapping("/{userId}/unfollow")
    public ResponseEntity<ApiResponse> unfollowUser(@PathVariable Long userId) {
        followService.unfollowUser(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Successfully unfollowed user"));
    }
    
    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<UserDTO>> getFollowers(@PathVariable Long userId) {
        List<User> followers = followService.getFollowers(userId);
        List<UserDTO> dtos = followers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/{userId}/following")
    public ResponseEntity<List<UserDTO>> getFollowing(@PathVariable Long userId) {
        List<User> following = followService.getFollowing(userId);
        List<UserDTO> dtos = following.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/{userId}/follow-stats")
    public ResponseEntity<Map<String, Object>> getFollowStats(@PathVariable Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("followersCount", followService.getFollowerCount(userId));
        stats.put("followingCount", followService.getFollowingCount(userId));
        stats.put("isFollowing", followService.isFollowing(userId));
        return ResponseEntity.ok(stats);
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}

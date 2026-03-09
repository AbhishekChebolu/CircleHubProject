package com.circlehub.service;

import com.circlehub.dto.PostDTO;
import com.circlehub.model.Post;
import com.circlehub.model.User;
import com.circlehub.model.UserFollow;
import com.circlehub.repository.PostRepository;
import com.circlehub.repository.UserFollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserFollowRepository userFollowRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PostService postService;
    
    /**
     * Get personalized home feed for authenticated user
     * Shows posts from followed users and user's own posts
     */
    public List<PostDTO> getHomeFeed(int page, int size) {
        User currentUser = userService.getCurrentUser();
        
        // Get users that current user follows
        List<UserFollow> following = userFollowRepository.findByFollower(currentUser);
        List<Long> followedUserIds = following.stream()
                .map(uf -> uf.getFollowing().getId())
                .collect(Collectors.toList());
        
        // Add current user's ID to get their posts too
        followedUserIds.add(currentUser.getId());
        
        // Get posts from followed users and current user
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByUserIdIn(followedUserIds, pageable);
        
        return posts.stream()
                .map(postService::convertPostToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get trending feed with engagement-based ranking
     * Algorithm: prioritize posts with high engagement in recent time
     */
    public List<PostDTO> getTrendingFeed(int page, int size) {
        User currentUser = null;
        try {
            currentUser = userService.getCurrentUser();
        } catch (Exception e) {
            // User not authenticated
        }
        
        // Get recent posts (last 7 days)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        Pageable pageable = PageRequest.of(0, size * 3); // Get more posts for ranking
        Page<Post> recentPosts = postRepository.findByCreatedAtAfter(sevenDaysAgo, pageable);
        
        // Calculate engagement score and sort
        List<Post> sortedPosts = recentPosts.stream()
                .sorted(Comparator.comparingDouble(this::calculateEngagementScore).reversed())
                .skip((long) page * size)
                .limit(size)
                .collect(Collectors.toList());
        
        User finalCurrentUser = currentUser;
        return sortedPosts.stream()
                .map(post -> postService.convertPostToDTOForUser(post, finalCurrentUser))
                .collect(Collectors.toList());
    }
    
    /**
     * Get explore feed - all public posts
     */
    public List<PostDTO> getExploreFeed(int page, int size) {
        User currentUser = null;
        try {
            currentUser = userService.getCurrentUser();
        } catch (Exception e) {
            // User not authenticated
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findAll(pageable);
        
        User finalCurrentUser = currentUser;
        return posts.stream()
                .map(post -> postService.convertPostToDTOForUser(post, finalCurrentUser))
                .collect(Collectors.toList());
    }
    
    /**
     * Get circle-specific feed
     */
    public List<PostDTO> getCircleFeed(Long circleId, int page, int size) {
        User currentUser = null;
        try {
            currentUser = userService.getCurrentUser();
        } catch (Exception e) {
            // User not authenticated
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByCircleId(circleId, pageable);
        
        User finalCurrentUser = currentUser;
        return posts.stream()
                .map(post -> postService.convertPostToDTOForUser(post, finalCurrentUser))
                .collect(Collectors.toList());
    }
    
    /**
     * Calculate engagement score for trending algorithm
     * Formula: (likes * 1.0 + comments * 2.0) / age_in_hours^1.5
     */
    private double calculateEngagementScore(Post post) {
        int likeCount = post.getLikes() != null ? post.getLikes().size() : 0;
        int commentCount = post.getComments() != null ? post.getComments().size() : 0;
        
        // Calculate age in hours
        LocalDateTime now = LocalDateTime.now();
        long ageInHours = java.time.Duration.between(post.getCreatedAt(), now).toHours();
        ageInHours = Math.max(1, ageInHours); // Minimum 1 hour to avoid division by zero
        
        // Weighted engagement score with time decay
        double engagementScore = (likeCount * 1.0 + commentCount * 2.0);
        double timeDecay = Math.pow(ageInHours, 1.5);
        
        return engagementScore / timeDecay;
    }
}

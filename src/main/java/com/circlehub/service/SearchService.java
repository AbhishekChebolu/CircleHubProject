package com.circlehub.service;

import com.circlehub.dto.CircleDTO;
import com.circlehub.dto.PostDTO;
import com.circlehub.dto.UserDTO;
import com.circlehub.model.Circle;
import com.circlehub.model.Post;
import com.circlehub.model.User;
import com.circlehub.repository.CircleRepository;
import com.circlehub.repository.PostRepository;
import com.circlehub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SearchService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CircleRepository circleRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserService userService;
    
    public Map<String, Object> searchAll(String query, Pageable pageable) {
        Map<String, Object> results = new HashMap<>();
        
        // Search users
        List<User> users = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                query, query, pageable);
        results.put("users", users.stream().map(this::convertUserToDTO).collect(Collectors.toList()));
        
        // Search circles
        List<Circle> circles = circleRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                query, query, pageable);
        results.put("circles", circles.stream().map(this::convertCircleToDTO).collect(Collectors.toList()));
        
        // Search posts
        Page<Post> posts = postRepository.findByContentContainingIgnoreCase(query, pageable);
        results.put("posts", posts.stream().map(this::convertPostToDTO).collect(Collectors.toList()));
        
        return results;
    }
    
    public List<UserDTO> searchUsers(String query, Pageable pageable) {
        List<User> users = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                query, query, pageable);
        return users.stream().map(this::convertUserToDTO).collect(Collectors.toList());
    }
    
    public List<CircleDTO> searchCircles(String query, Pageable pageable) {
        List<Circle> circles = circleRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                query, query, pageable);
        return circles.stream().map(this::convertCircleToDTO).collect(Collectors.toList());
    }
    
    public List<PostDTO> searchPosts(String query, Pageable pageable) {
        Page<Post> posts = postRepository.findByContentContainingIgnoreCase(query, pageable);
        return posts.stream().map(this::convertPostToDTO).collect(Collectors.toList());
    }
    
    private UserDTO convertUserToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setCoverPicture(user.getCoverPicture());
        dto.setWebsite(user.getWebsite());
        dto.setLocation(user.getLocation());
        dto.setVerified(user.getIsVerified());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
    
    private CircleDTO convertCircleToDTO(Circle circle) {
        CircleDTO dto = new CircleDTO();
        dto.setId(circle.getId());
        dto.setName(circle.getName());
        dto.setDescription(circle.getDescription());
        dto.setCreatorId(circle.getCreator().getId());
        dto.setCreatorName(circle.getCreator().getName());
        dto.setCreatedAt(circle.getCreatedAt());
        dto.setMemberCount(circle.getMembers() != null ? circle.getMembers().size() : 0);
        return dto;
    }
    
    private PostDTO convertPostToDTO(Post post) {
        User currentUser = null;
        try {
            currentUser = userService.getCurrentUser();
        } catch (Exception e) {
            // User not authenticated
        }
        
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setMediaUrls(post.getMediaUrls());
        dto.setMediaType(post.getMediaType());
        dto.setUserId(post.getUser().getId());
        dto.setUserName(post.getUser().getName());
        dto.setUserProfilePicture(post.getUser().getProfilePicture());
        dto.setCircleId(post.getCircle() != null ? post.getCircle().getId() : null);
        dto.setCircleName(post.getCircle() != null ? post.getCircle().getName() : null);
        dto.setLikeCount(post.getLikes() != null ? post.getLikes().size() : 0);
        dto.setCommentCount(post.getComments() != null ? post.getComments().size() : 0);
        dto.setCreatedAt(post.getCreatedAt());
        dto.setEdited(post.getIsEdited() != null && post.getIsEdited());
        dto.setUpdatedAt(post.getUpdatedAt());
        
        if (currentUser != null) {
            dto.setSavedByCurrentUser(post.getSavedBy() != null && 
                    post.getSavedBy().stream().anyMatch(sp -> sp.getUser().getId().equals(currentUser.getId())));
        }
        
        return dto;
    }
}

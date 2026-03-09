package com.circlehub.service;

import com.circlehub.dto.CreatePostRequest;
import com.circlehub.dto.PostDTO;
import com.circlehub.model.Circle;
import com.circlehub.model.Post;
import com.circlehub.model.User;
import com.circlehub.repository.CircleRepository;
import com.circlehub.repository.LikeRepository;
import com.circlehub.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private CircleRepository circleRepository;
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    @Autowired
    private SavedPostService savedPostService;
    
    @Autowired
    private NotificationService notificationService;
    
    public PostDTO createPost(CreatePostRequest request) {
        User currentUser = userService.getCurrentUser();
        Circle circle = circleRepository.findById(request.getCircleId())
                .orElseThrow(() -> new RuntimeException("Circle not found"));
        
        Post post = new Post();
        post.setContent(request.getContent());
        post.setMediaUrls(request.getMediaUrls());
        post.setMediaType(request.getMediaType() != null ? request.getMediaType() : Post.MediaType.NONE);
        post.setUser(currentUser);
        post.setCircle(circle);
        post.setIsEdited(false);
        
        post = postRepository.save(post);
        
        return convertToDTO(post, currentUser);
    }
    
    public PostDTO updatePost(Long postId, String content) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only edit your own posts");
        }
        
        post.setContent(content);
        post.setIsEdited(true);
        post.setUpdatedAt(LocalDateTime.now());
        
        post = postRepository.save(post);
        
        return convertToDTO(post, currentUser);
    }
    
    public void deletePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own posts");
        }
        
        postRepository.delete(post);
    }
    
    public List<PostDTO> getPostsByCircle(Long circleId) {
        User currentUser = userService.getCurrentUser();
        List<Post> posts = postRepository.findByCircleIdOrderByCreatedAtDesc(circleId);
        
        return posts.stream()
                .map(post -> convertToDTO(post, currentUser))
                .collect(Collectors.toList());
    }
    
    public PostDTO convertPostToDTO(Post post) {
        User currentUser = null;
        try {
            currentUser = userService.getCurrentUser();
        } catch (Exception e) {
            // User not authenticated
        }
        return convertToDTO(post, currentUser);
    }
    
    public PostDTO convertPostToDTOForUser(Post post, User user) {
        return convertToDTO(post, user);
    }
    
    private PostDTO convertToDTO(Post post, User currentUser) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setMediaUrls(post.getMediaUrls());
        dto.setMediaType(post.getMediaType());
        dto.setIsEdited(post.getIsEdited());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUserId(post.getUser().getId());
        dto.setUserName(post.getUser().getName());
        dto.setUserProfilePicture(post.getUser().getProfilePicture());
        dto.setCircleId(post.getCircle().getId());
        dto.setCircleName(post.getCircle().getName());
        dto.setLikeCount(likeRepository.countByPost(post));
        dto.setCommentCount(post.getComments() != null ? post.getComments().size() : 0);
        
        if (currentUser != null) {
            dto.setIsLikedByCurrentUser(likeRepository.existsByUserAndPost(currentUser, post));
            dto.setIsSavedByCurrentUser(savedPostService.isSaved(post.getId()));
        } else {
            dto.setIsLikedByCurrentUser(false);
            dto.setIsSavedByCurrentUser(false);
        }
        
        return dto;
    }
}

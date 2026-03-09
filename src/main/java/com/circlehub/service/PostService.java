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

import java.util.List;
import java.util.stream.Collectors;

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
    
    public PostDTO createPost(CreatePostRequest request) {
        User currentUser = userService.getCurrentUser();
        Circle circle = circleRepository.findById(request.getCircleId())
                .orElseThrow(() -> new RuntimeException("Circle not found"));
        
        Post post = new Post();
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setUser(currentUser);
        post.setCircle(circle);
        
        post = postRepository.save(post);
        
        return convertToDTO(post, currentUser);
    }
    
    public List<PostDTO> getPostsByCircle(Long circleId) {
        User currentUser = userService.getCurrentUser();
        List<Post> posts = postRepository.findByCircleIdOrderByCreatedAtDesc(circleId);
        
        return posts.stream()
                .map(post -> convertToDTO(post, currentUser))
                .collect(Collectors.toList());
    }
    
    private PostDTO convertToDTO(Post post, User currentUser) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUserId(post.getUser().getId());
        dto.setUserName(post.getUser().getName());
        dto.setUserProfilePicture(post.getUser().getProfilePicture());
        dto.setCircleId(post.getCircle().getId());
        dto.setCircleName(post.getCircle().getName());
        dto.setLikeCount(likeRepository.countByPost(post));
        dto.setCommentCount(post.getComments().size());
        dto.setIsLikedByCurrentUser(likeRepository.existsByUserAndPost(currentUser, post));
        return dto;
    }
}

package com.circlehub.service;

import com.circlehub.dto.CommentDTO;
import com.circlehub.dto.CreateCommentRequest;
import com.circlehub.model.Comment;
import com.circlehub.model.Post;
import com.circlehub.model.User;
import com.circlehub.repository.CommentRepository;
import com.circlehub.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserService userService;
    
    public CommentDTO addComment(CreateCommentRequest request) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(currentUser);
        comment.setPost(post);
        
        comment = commentRepository.save(comment);
        
        return convertToDTO(comment);
    }
    
    public List<CommentDTO> getCommentsByPost(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        
        return comments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUserId(comment.getUser().getId());
        dto.setUserName(comment.getUser().getName());
        dto.setUserProfilePicture(comment.getUser().getProfilePicture());
        dto.setPostId(comment.getPost().getId());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}

package com.circlehub.service;

import com.circlehub.dto.CommentDTO;
import com.circlehub.dto.CreateCommentRequest;
import com.circlehub.model.Comment;
import com.circlehub.model.Post;
import com.circlehub.model.User;
import com.circlehub.repository.CommentRepository;
import com.circlehub.repository.PostRepository;
import com.circlehub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;
    
    public CommentDTO addComment(CreateCommentRequest request) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(currentUser);
        comment.setPost(post);
        
        // Handle nested replies
        if (request.getParentId() != null) {
            Comment parentComment = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parentComment);
            
            // Notify parent comment author
            if (!parentComment.getUser().getId().equals(currentUser.getId())) {
                notificationService.notifyComment(parentComment.getUser(), currentUser, post, comment);
            }
        } else {
            // Notify post author (for top-level comments)
            if (!post.getUser().getId().equals(currentUser.getId())) {
                notificationService.notifyComment(post.getUser(), currentUser, post, comment);
            }
        }
        
        comment = commentRepository.save(comment);
        
        // Check for mentions in comment content and notify mentioned users
        notifyMentionedUsers(comment);
        
        return convertToDTO(comment);
    }
    
    public List<CommentDTO> getCommentsByPost(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        
        // Only return top-level comments (parent == null)
        List<Comment> topLevelComments = comments.stream()
                .filter(c -> c.getParent() == null)
                .collect(Collectors.toList());
        
        return topLevelComments.stream()
                .map(this::convertToDTOWithReplies)
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
        dto.setParentId(comment.getParent() != null ? comment.getParent().getId() : null);
        dto.setReplyCount(comment.getReplies() != null ? comment.getReplies().size() : 0);
        return dto;
    }
    
    private CommentDTO convertToDTOWithReplies(Comment comment) {
        CommentDTO dto = convertToDTO(comment);
        
        // Add nested replies
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            List<CommentDTO> replyDTOs = comment.getReplies().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            dto.setReplies(replyDTOs);
        } else {
            dto.setReplies(new ArrayList<>());
        }
        
        return dto;
    }
    
    private void notifyMentionedUsers(Comment comment) {
        // Pattern to match @username mentions
        Pattern mentionPattern = Pattern.compile("@([a-zA-Z0-9_]+)");
        Matcher matcher = mentionPattern.matcher(comment.getContent());
        
        while (matcher.find()) {
            String username = matcher.group(1);
            userRepository.findByEmail(username + "@email.com").ifPresent(mentionedUser -> {
                // Don't notify if user mentions themselves
                if (!mentionedUser.getId().equals(comment.getUser().getId())) {
                    notificationService.notifyMention(mentionedUser, comment.getUser(), comment.getPost(), comment);
                }
            });
        }
    }
}

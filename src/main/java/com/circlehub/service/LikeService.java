package com.circlehub.service;

import com.circlehub.model.Like;
import com.circlehub.model.Post;
import com.circlehub.model.User;
import com.circlehub.repository.LikeRepository;
import com.circlehub.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikeService {
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Transactional
    public void toggleLike(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (likeRepository.existsByUserAndPost(currentUser, post)) {
            Like like = likeRepository.findByUserAndPost(currentUser, post)
                    .orElseThrow(() -> new RuntimeException("Like not found"));
            likeRepository.delete(like);
        } else {
            Like like = new Like();
            like.setUser(currentUser);
            like.setPost(post);
            likeRepository.save(like);
            
            // Notify post author (don't notify if user likes their own post)
            if (!post.getUser().getId().equals(currentUser.getId())) {
                notificationService.notifyLike(post.getUser(), currentUser, post);
            }
        }
    }
}

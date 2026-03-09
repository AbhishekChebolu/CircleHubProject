package com.circlehub.service;

import com.circlehub.model.Post;
import com.circlehub.model.SavedPost;
import com.circlehub.model.User;
import com.circlehub.repository.PostRepository;
import com.circlehub.repository.SavedPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SavedPostService {
    
    @Autowired
    private SavedPostRepository savedPostRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserService userService;
    
    @Transactional
    public void savePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (savedPostRepository.existsByUserAndPost(currentUser, post)) {
            throw new RuntimeException("Post already saved");
        }
        
        SavedPost savedPost = new SavedPost();
        savedPost.setUser(currentUser);
        savedPost.setPost(post);
        savedPostRepository.save(savedPost);
    }
    
    @Transactional
    public void unsavePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        SavedPost savedPost = savedPostRepository.findByUserAndPost(currentUser, post)
                .orElseThrow(() -> new RuntimeException("Post not saved"));
        
        savedPostRepository.delete(savedPost);
    }
    
    public boolean isSaved(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        return savedPostRepository.existsByUserAndPost(currentUser, post);
    }
    
    public Page<SavedPost> getSavedPosts(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        return savedPostRepository.findByUserOrderBySavedAtDesc(currentUser, pageable);
    }
}

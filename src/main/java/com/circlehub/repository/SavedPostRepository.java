package com.circlehub.repository;

import com.circlehub.model.Post;
import com.circlehub.model.SavedPost;
import com.circlehub.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {
    Optional<SavedPost> findByUserAndPost(User user, Post post);
    
    Boolean existsByUserAndPost(User user, Post post);
    
    Page<SavedPost> findByUserOrderBySavedAtDesc(User user, Pageable pageable);
    
    void deleteByUserAndPost(User user, Post post);
}

package com.circlehub.repository;

import com.circlehub.model.Like;
import com.circlehub.model.Post;
import com.circlehub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndPost(User user, Post post);
    Boolean existsByUserAndPost(User user, Post post);
    Integer countByPost(Post post);
}

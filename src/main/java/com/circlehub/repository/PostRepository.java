package com.circlehub.repository;

import com.circlehub.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByCircleIdOrderByCreatedAtDesc(Long circleId);
    Page<Post> findByContentContainingIgnoreCase(String content, Pageable pageable);
    Page<Post> findByUserIdIn(List<Long> userIds, Pageable pageable);
    Page<Post> findByCreatedAtAfter(LocalDateTime date, Pageable pageable);
    Page<Post> findByCircleId(Long circleId, Pageable pageable);
}

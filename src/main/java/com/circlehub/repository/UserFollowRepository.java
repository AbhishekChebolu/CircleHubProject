package com.circlehub.repository;

import com.circlehub.model.User;
import com.circlehub.model.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, Long> {
    Optional<UserFollow> findByFollowerAndFollowing(User follower, User following);
    
    Boolean existsByFollowerAndFollowing(User follower, User following);
    
    List<UserFollow> findByFollower(User follower);
    
    List<UserFollow> findByFollowing(User following);
    
    @Query("SELECT COUNT(uf) FROM UserFollow uf WHERE uf.following = ?1")
    Long countFollowers(User user);
    
    @Query("SELECT COUNT(uf) FROM UserFollow uf WHERE uf.follower = ?1")
    Long countFollowing(User user);
    
    void deleteByFollowerAndFollowing(User follower, User following);
}

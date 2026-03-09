package com.circlehub.repository;

import com.circlehub.model.Circle;
import com.circlehub.model.CircleMember;
import com.circlehub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CircleMemberRepository extends JpaRepository<CircleMember, Long> {
    Optional<CircleMember> findByUserAndCircle(User user, Circle circle);
    Boolean existsByUserAndCircle(User user, Circle circle);
}

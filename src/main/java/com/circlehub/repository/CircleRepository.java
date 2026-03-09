package com.circlehub.repository;

import com.circlehub.model.Circle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CircleRepository extends JpaRepository<Circle, Long> {
    Optional<Circle> findByName(String name);
    Boolean existsByName(String name);
}

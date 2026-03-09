package com.circlehub.service;

import com.circlehub.dto.CircleDTO;
import com.circlehub.dto.CreateCircleRequest;
import com.circlehub.model.Circle;
import com.circlehub.model.CircleMember;
import com.circlehub.model.User;
import com.circlehub.repository.CircleMemberRepository;
import com.circlehub.repository.CircleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CircleService {
    
    @Autowired
    private CircleRepository circleRepository;
    
    @Autowired
    private CircleMemberRepository circleMemberRepository;
    
    @Autowired
    private UserService userService;
    
    @Transactional
    public CircleDTO createCircle(CreateCircleRequest request) {
        if (circleRepository.existsByName(request.getName())) {
            throw new RuntimeException("Circle name already exists");
        }
        
        User currentUser = userService.getCurrentUser();
        
        Circle circle = new Circle();
        circle.setName(request.getName());
        circle.setDescription(request.getDescription());
        circle.setCategory(request.getCategory());
        circle.setCreatedBy(currentUser);
        
        circle = circleRepository.save(circle);
        
        // Automatically join the creator to the circle
        CircleMember member = new CircleMember();
        member.setUser(currentUser);
        member.setCircle(circle);
        circleMemberRepository.save(member);
        
        return convertToDTO(circle);
    }
    
    public List<CircleDTO> getAllCircles() {
        return circleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void joinCircle(Long circleId) {
        User currentUser = userService.getCurrentUser();
        Circle circle = circleRepository.findById(circleId)
                .orElseThrow(() -> new RuntimeException("Circle not found"));
        
        if (circleMemberRepository.existsByUserAndCircle(currentUser, circle)) {
            throw new RuntimeException("Already a member of this circle");
        }
        
        CircleMember member = new CircleMember();
        member.setUser(currentUser);
        member.setCircle(circle);
        circleMemberRepository.save(member);
    }
    
    @Transactional
    public void leaveCircle(Long circleId) {
        User currentUser = userService.getCurrentUser();
        Circle circle = circleRepository.findById(circleId)
                .orElseThrow(() -> new RuntimeException("Circle not found"));
        
        CircleMember member = circleMemberRepository.findByUserAndCircle(currentUser, circle)
                .orElseThrow(() -> new RuntimeException("Not a member of this circle"));
        
        circleMemberRepository.delete(member);
    }
    
    private CircleDTO convertToDTO(Circle circle) {
        CircleDTO dto = new CircleDTO();
        dto.setId(circle.getId());
        dto.setName(circle.getName());
        dto.setDescription(circle.getDescription());
        dto.setCategory(circle.getCategory());
        dto.setCreatedById(circle.getCreatedBy().getId());
        dto.setCreatedByName(circle.getCreatedBy().getName());
        dto.setCreatedAt(circle.getCreatedAt());
        dto.setMemberCount(circle.getMembers().size());
        return dto;
    }
}

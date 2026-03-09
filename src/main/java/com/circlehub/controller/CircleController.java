package com.circlehub.controller;

import com.circlehub.dto.ApiResponse;
import com.circlehub.dto.CircleDTO;
import com.circlehub.dto.CreateCircleRequest;
import com.circlehub.service.CircleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/circles")
@CrossOrigin(origins = "*")
public class CircleController {
    
    @Autowired
    private CircleService circleService;
    
    @PostMapping("/create")
    public ResponseEntity<CircleDTO> createCircle(@Valid @RequestBody CreateCircleRequest request) {
        CircleDTO circle = circleService.createCircle(request);
        return ResponseEntity.ok(circle);
    }
    
    @GetMapping
    public ResponseEntity<List<CircleDTO>> getAllCircles() {
        List<CircleDTO> circles = circleService.getAllCircles();
        return ResponseEntity.ok(circles);
    }
    
    @PostMapping("/join")
    public ResponseEntity<ApiResponse> joinCircle(@RequestParam Long circleId) {
        circleService.joinCircle(circleId);
        return ResponseEntity.ok(new ApiResponse(true, "Successfully joined circle"));
    }
    
    @PostMapping("/leave")
    public ResponseEntity<ApiResponse> leaveCircle(@RequestParam Long circleId) {
        circleService.leaveCircle(circleId);
        return ResponseEntity.ok(new ApiResponse(true, "Successfully left circle"));
    }
}

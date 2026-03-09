package com.circlehub.controller;

import com.circlehub.dto.CircleDTO;
import com.circlehub.dto.PostDTO;
import com.circlehub.dto.UserDTO;
import com.circlehub.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {
    
    @Autowired
    private SearchService searchService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> searchAll(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Map<String, Object> results = searchService.searchAll(query, pageable);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        List<UserDTO> users = searchService.searchUsers(query, pageable);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/circles")
    public ResponseEntity<List<CircleDTO>> searchCircles(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        List<CircleDTO> circles = searchService.searchCircles(query, pageable);
        return ResponseEntity.ok(circles);
    }
    
    @GetMapping("/posts")
    public ResponseEntity<List<PostDTO>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        List<PostDTO> posts = searchService.searchPosts(query, pageable);
        return ResponseEntity.ok(posts);
    }
}

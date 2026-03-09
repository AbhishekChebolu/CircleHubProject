package com.circlehub.controller;

import com.circlehub.dto.PostDTO;
import com.circlehub.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
@CrossOrigin(origins = "*")
public class FeedController {
    
    @Autowired
    private FeedService feedService;
    
    /**
     * GET /api/feed/home - Personalized feed from followed users
     */
    @GetMapping("/home")
    public ResponseEntity<List<PostDTO>> getHomeFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<PostDTO> posts = feedService.getHomeFeed(page, size);
        return ResponseEntity.ok(posts);
    }
    
    /**
     * GET /api/feed/trending - Trending posts based on engagement
     */
    @GetMapping("/trending")
    public ResponseEntity<List<PostDTO>> getTrendingFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<PostDTO> posts = feedService.getTrendingFeed(page, size);
        return ResponseEntity.ok(posts);
    }
    
    /**
     * GET /api/feed/explore - All public posts
     */
    @GetMapping("/explore")
    public ResponseEntity<List<PostDTO>> getExploreFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<PostDTO> posts = feedService.getExploreFeed(page, size);
        return ResponseEntity.ok(posts);
    }
    
    /**
     * GET /api/feed/circle/{circleId} - Circle-specific feed
     */
    @GetMapping("/circle/{circleId}")
    public ResponseEntity<List<PostDTO>> getCircleFeed(
            @PathVariable Long circleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<PostDTO> posts = feedService.getCircleFeed(circleId, page, size);
        return ResponseEntity.ok(posts);
    }
}

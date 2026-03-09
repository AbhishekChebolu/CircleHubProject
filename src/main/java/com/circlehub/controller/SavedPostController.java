package com.circlehub.controller;

import com.circlehub.dto.ApiResponse;
import com.circlehub.dto.PostDTO;
import com.circlehub.model.SavedPost;
import com.circlehub.service.SavedPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class SavedPostController {
    
    @Autowired
    private SavedPostService savedPostService;
    
    @PostMapping("/{postId}/save")
    public ResponseEntity<ApiResponse> savePost(@PathVariable Long postId) {
        savedPostService.savePost(postId);
        return ResponseEntity.ok(new ApiResponse(true, "Post saved successfully"));
    }
    
    @DeleteMapping("/{postId}/unsave")
    public ResponseEntity<ApiResponse> unsavePost(@PathVariable Long postId) {
        savedPostService.unsavePost(postId);
        return ResponseEntity.ok(new ApiResponse(true, "Post unsaved successfully"));
    }
    
    @GetMapping("/{postId}/is-saved")
    public ResponseEntity<Map<String, Boolean>> isSaved(@PathVariable Long postId) {
        boolean saved = savedPostService.isSaved(postId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isSaved", saved);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/saved")
    public ResponseEntity<Page<SavedPost>> getSavedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<SavedPost> savedPosts = savedPostService.getSavedPosts(page, size);
        return ResponseEntity.ok(savedPosts);
    }
}

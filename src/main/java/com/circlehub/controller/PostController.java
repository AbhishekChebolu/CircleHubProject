package com.circlehub.controller;

import com.circlehub.dto.ApiResponse;
import com.circlehub.dto.CreatePostRequest;
import com.circlehub.dto.PostDTO;
import com.circlehub.service.LikeService;
import com.circlehub.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    
    @Autowired
    private PostService postService;
    
    @Autowired
    private LikeService likeService;
    
    @PostMapping("/create")
    public ResponseEntity<PostDTO> createPost(@Valid @RequestBody CreatePostRequest request) {
        PostDTO post = postService.createPost(request);
        return ResponseEntity.ok(post);
    }
    
    @GetMapping("/circle/{circleId}")
    public ResponseEntity<List<PostDTO>> getPostsByCircle(@PathVariable Long circleId) {
        List<PostDTO> posts = postService.getPostsByCircle(circleId);
        return ResponseEntity.ok(posts);
    }
    
    @PostMapping("/{postId}/like")
    public ResponseEntity<ApiResponse> toggleLike(@PathVariable Long postId) {
        likeService.toggleLike(postId);
        return ResponseEntity.ok(new ApiResponse(true, "Like toggled successfully"));
    }
}

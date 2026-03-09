package com.circlehub.controller;

import com.circlehub.dto.CommentDTO;
import com.circlehub.dto.CreateCommentRequest;
import com.circlehub.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    @PostMapping("/add")
    public ResponseEntity<CommentDTO> addComment(@Valid @RequestBody CreateCommentRequest request) {
        CommentDTO comment = commentService.addComment(request);
        return ResponseEntity.ok(comment);
    }
    
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPost(@PathVariable Long postId) {
        List<CommentDTO> comments = commentService.getCommentsByPost(postId);
        return ResponseEntity.ok(comments);
    }
}

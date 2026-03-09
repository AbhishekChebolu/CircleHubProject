package com.circlehub.controller;

import com.circlehub.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*")
public class MediaController {
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> result = cloudinaryService.uploadFile(file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("url", result.get("secure_url"));
            response.put("publicId", result.get("public_id"));
            response.put("format", result.get("format"));
            response.put("width", result.get("width"));
            response.put("height", result.get("height"));
            response.put("size", result.get("bytes"));
            response.put("resourceType", result.get("resource_type"));
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/upload-multiple")
    public ResponseEntity<?> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        try {
            List<Map<String, Object>> responses = new ArrayList<>();
            
            for (MultipartFile file : files) {
                Map<String, Object> result = cloudinaryService.uploadFile(file);
                
                Map<String, Object> response = new HashMap<>();
                response.put("url", result.get("secure_url"));
                response.put("publicId", result.get("public_id"));
                response.put("format", result.get("format"));
                response.put("resourceType", result.get("resource_type"));
                
                responses.add(response);
            }
            
            return ResponseEntity.ok(responses);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{publicId}")
    public ResponseEntity<?> deleteFile(@PathVariable String publicId) {
        try {
            cloudinaryService.deleteFile(publicId);
            return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "File deletion failed: " + e.getMessage()));
        }
    }
}

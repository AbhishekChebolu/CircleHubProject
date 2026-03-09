package com.circlehub.dto;

import com.circlehub.model.Post;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    
    private String content;
    
    private String mediaUrls; // JSON array of media URLs
    
    private Post.MediaType mediaType;
    
    @NotNull(message = "Circle ID is required")
    private Long circleId;
}

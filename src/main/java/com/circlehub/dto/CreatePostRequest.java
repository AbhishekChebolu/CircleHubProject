package com.circlehub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private String imageUrl;
    
    @NotNull(message = "Circle ID is required")
    private Long circleId;
}

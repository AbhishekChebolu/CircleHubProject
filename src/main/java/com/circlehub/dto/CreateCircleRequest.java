package com.circlehub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCircleRequest {
    
    @NotBlank(message = "Circle name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;
}

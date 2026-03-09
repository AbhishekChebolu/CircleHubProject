package com.circlehub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CircleDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private Integer memberCount;
}

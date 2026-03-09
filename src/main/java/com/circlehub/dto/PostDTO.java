package com.circlehub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private Long id;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private Long userId;
    private String userName;
    private String userProfilePicture;
    private Long circleId;
    private String circleName;
    private Integer likeCount;
    private Integer commentCount;
    private Boolean isLikedByCurrentUser;
}

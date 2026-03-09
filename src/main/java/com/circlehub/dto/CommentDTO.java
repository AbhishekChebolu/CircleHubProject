package com.circlehub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private String content;
    private Long userId;
    private String userName;
    private String userProfilePicture;
    private Long postId;
    private LocalDateTime createdAt;
    private Long parentId; // null for top-level comments
    private List<CommentDTO> replies; // nested replies
    private Integer replyCount; // count of direct replies
}

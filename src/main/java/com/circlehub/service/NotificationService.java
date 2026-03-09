package com.circlehub.service;

import com.circlehub.model.Notification;
import com.circlehub.model.User;
import com.circlehub.model.Post;
import com.circlehub.model.Comment;
import com.circlehub.repository.NotificationRepository;
import com.circlehub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public Notification createNotification(
            Long userId, 
            Long actorId, 
            Notification.NotificationType type,
            Long referenceId,
            String content) {
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new RuntimeException("Actor not found"));
        
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setActor(actor);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        notification.setContent(content);
        notification.setIsRead(false);
        
        notification = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        messagingTemplate.convertAndSendToUser(
                user.getId().toString(),
                "/queue/notifications",
                notification
        );
        
        return notification;
    }
    
    public Page<Notification> getUserNotifications(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByUserOrderByCreatedAtDesc(currentUser, pageable);
    }
    
    public List<Notification> getUnreadNotifications() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(currentUser);
    }
    
    public Long getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.countUnreadByUser(currentUser);
    }
    
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllAsRead() {
        User currentUser = userService.getCurrentUser();
        notificationRepository.markAllAsReadByUser(currentUser);
    }
    
    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    // Helper methods to create specific notification types
    public void notifyLike(User postOwner, User liker, Post post) {
        if (!postOwner.getId().equals(liker.getId())) { // Don't notify self
            createNotification(
                    postOwner.getId(),
                    liker.getId(),
                    Notification.NotificationType.LIKE,
                    post.getId(),
                    "liked your post"
            );
        }
    }
    
    public void notifyComment(User postOwner, User commenter, Post post, Comment comment) {
        if (!postOwner.getId().equals(commenter.getId())) {
            createNotification(
                    postOwner.getId(),
                    commenter.getId(),
                    Notification.NotificationType.COMMENT,
                    post.getId(),
                    "commented on your post"
            );
        }
    }
    
    public void notifyFollow(User followedUser, User follower) {
        createNotification(
                followedUser.getId(),
                follower.getId(),
                Notification.NotificationType.FOLLOW,
                null,
                "started following you"
        );
    }
    
    public void notifyMention(User mentionedUser, User mentioner, Post post, Comment comment) {
        createNotification(
                mentionedUser.getId(),
                mentioner.getId(),
                Notification.NotificationType.MENTION,
                post.getId(),
                "mentioned you in a comment"
        );
    }
}

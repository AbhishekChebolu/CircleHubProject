package com.circlehub.controller;

import com.circlehub.dto.UpdateUserRequest;
import com.circlehub.dto.UserDTO;
import com.circlehub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/update")
    public ResponseEntity<UserDTO> updateUser(@RequestBody UpdateUserRequest request) {
        UserDTO user = userService.updateUser(request);
        return ResponseEntity.ok(user);
    }
}

package com.project.MailForge.controller;

import com.project.MailForge.dto.UserRequest;
import com.project.MailForge.dto.UserResponse;
import com.project.MailForge.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me") // No more /{userId} in the path!
    public ResponseEntity<UserResponse> getUserProfile(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

//    @PostMapping("/internal")
//    public ResponseEntity<UserResponse>  createUserInternal(@Valid @RequestBody UserRequest userRequest){
//        return ResponseEntity.ok(userService.createInternalUser(userRequest));
//    }

    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId){
        return ResponseEntity.ok(userService.existsById(userId));
    }
}

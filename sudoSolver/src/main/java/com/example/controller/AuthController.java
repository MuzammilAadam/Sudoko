package com.example.controller;

import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.dto.SignupRequest;
import com.example.entity.User;
import com.example.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174"}, originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("signup")
    public ResponseEntity<User> signup(@RequestBody SignupRequest request){
        User user = authService.signup(request);

        return new ResponseEntity<>(user , HttpStatus.CREATED);
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request){
        LoginResponse loginResponse = authService.login(request);

        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}

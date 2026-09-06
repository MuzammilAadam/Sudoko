package com.example.service;

import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.dto.SignupRequest;
import com.example.entity.Role;
import com.example.entity.User;
import com.example.repository.UserRepository;
import com.example.security.JwtService;
import lombok.extern.java.Log;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService =jwtService;
    }

    public User signup(SignupRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email is already registered");
        }
        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username is already taken");
        }
        User user = new User();
        user.setUsername(request.getUsername());

        user.setEmail(request.getEmail());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole(Role.USER);

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(()->
                new RuntimeException("Invalid email or password"));
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                user.getId(),
                token,
                user.getUsername(),
                user.getRole().name(),
                user.getTotalXP(),
                user.getLevel()
        );
    }

}

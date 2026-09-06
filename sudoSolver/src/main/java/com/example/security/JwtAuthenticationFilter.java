package com.example.security;


import com.example.entity.User;
import com.example.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Get Authorization header
        System.out.println("Session Printing :-> "+request.getSession());
        String authHeader = request.getHeader("Authorization");

        // Check if header contains Bearer token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // Remove "Bearer " from token
        String token = authHeader.substring(7);

        // Validate token
        if (!jwtService.isTokenValid(token)) {

            filterChain.doFilter(request, response);
            return;
        }

        // Extract email from JWT
        String email = jwtService.extractEmail(token);

        // Check if user is already authenticated
        if (email != null &&
                SecurityContextHolder.getContext()
                        .getAuthentication() == null) {

            userRepository.findByEmail(email)
                    .ifPresent(user -> authenticateUser(
                            user,
                            request
                    ));
        }

        // Continue request
        filterChain.doFilter(request, response);
    }

    private void authenticateUser(
            User user,
            HttpServletRequest request) {

        // USER -> ROLE_USER
        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(
                        "ROLE_" + user.getRole().name()
                );

        // BUG FIX / CORRECTION:
        // Previously, 'user' (the User entity object) was passed as the principal here.
        // Because User does not implement Principal or UserDetails, calling authentication.getName()
        // later fell back to user.toString(), returning "com.example.entity.User@<hashcode>".
        // Passing user.getEmail() as the principal ensures authentication.getName() returns the actual email address.
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        List.of(authority)
                );

        authentication.setDetails(
                new WebAuthenticationDetailsSource()
                        .buildDetails(request)
        );

        SecurityContextHolder.getContext()
                .setAuthentication(authentication);
    }
}
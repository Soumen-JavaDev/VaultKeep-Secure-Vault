package com.vaultkeep.vaultkeep_backend.controller;

import com.vaultkeep.vaultkeep_backend.model.AuthRequest;
import com.vaultkeep.vaultkeep_backend.model.AuthResponse;
import com.vaultkeep.vaultkeep_backend.model.User;
import com.vaultkeep.vaultkeep_backend.repository.UserRepository;
import com.vaultkeep.vaultkeep_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allows React frontend to connect
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public String registerUser(@RequestBody AuthRequest authRequest) {
        // 1. Check if the username already exists
        if (userRepository.findByUsername(authRequest.getUsername()).isPresent()) {
            return "Error: Username is already taken!";
        }

        // 2. Create the new user and securely hash their password
        User newUser = new User();
        newUser.setUsername(authRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(authRequest.getPassword()));

        // 3. Save to MySQL
        userRepository.save(newUser);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public AuthResponse loginUser(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            // 1. Verify the username and password against the database
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (Exception ex) {
            throw new Exception("Invalid username or password");
        }

        // 2. If credentials are correct, generate and return the JWT
        String token = jwtUtil.generateToken(authRequest.getUsername());
        return new AuthResponse(token);
    }
}
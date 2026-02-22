package com.vaultkeep.vaultkeep_backend.controller;

import com.vaultkeep.vaultkeep_backend.model.Secret;
import com.vaultkeep.vaultkeep_backend.model.User;

import com.vaultkeep.vaultkeep_backend.repository.SecretRepository;
import com.vaultkeep.vaultkeep_backend.repository.UserRepository;
import com.vaultkeep.vaultkeep_backend.util.AESUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secrets")
@CrossOrigin(origins = "http://localhost:5173") // Allows your React frontend to connect
public class SecretController {

    @Autowired
    private SecretRepository secretRepository;

    @Autowired
    private UserRepository userRepository;

    // A helper method to get the currently logged-in user from the JWT token
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/add")
    public Secret addSecret(@RequestBody Secret request) {
        try {
            User currentUser = getCurrentUser();

            // 1. Encrypt the plain text content before saving it to MySQL
            String secureData = AESUtils.encrypt(request.getEncryptedContent());

            // 2. Create the secure entity tied to the current user's ID
            Secret secureSecret = new Secret();
            secureSecret.setUserId(currentUser.getId());
            secureSecret.setTitle(request.getTitle());
            secureSecret.setEncryptedContent(secureData);

            // 3. Save to database
            return secretRepository.save(secureSecret);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed: " + e.getMessage());
        }
    }

    @GetMapping("/my-secrets")
    public List<Secret> getMySecrets() {
        User currentUser = getCurrentUser();

        // 1. Fetch ONLY the documents belonging to the logged-in user
        List<Secret> secrets = secretRepository.findByUserId(currentUser.getId());

        // 2. Decrypt the content before sending it back to the React frontend
        secrets.forEach(secret -> {
            try {
                secret.setEncryptedContent(AESUtils.decrypt(secret.getEncryptedContent()));
            } catch (Exception e) {
                secret.setEncryptedContent("Error decrypting data");
            }
        });

        return secrets;
    }

}

package com.vaultkeep.vaultkeep_backend.repository;


import com.vaultkeep.vaultkeep_backend.model.Secret;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecretRepository extends JpaRepository<Secret, Long> {
    // Finds all encrypted documents belonging to a specific user
    List<Secret> findByUserId(Long userId);
}
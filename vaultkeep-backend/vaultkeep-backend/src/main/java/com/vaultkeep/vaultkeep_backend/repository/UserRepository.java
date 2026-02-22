package com.vaultkeep.vaultkeep_backend.repository;




import com.vaultkeep.vaultkeep_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA automatically writes the SQL query for this method!
    Optional<User> findByUsername(String username);
}

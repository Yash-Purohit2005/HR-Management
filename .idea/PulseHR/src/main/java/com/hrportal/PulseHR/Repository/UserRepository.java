package com.hrportal.PulseHR.Repository;

import com.hrportal.PulseHR.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<User> findBySetupToken(String token);
    @Query("SELECT u.email FROM User u JOIN u.roles r WHERE r = 'ADMIN' AND u.isActive = true")
    List<String> findAllAdminEmails();
}

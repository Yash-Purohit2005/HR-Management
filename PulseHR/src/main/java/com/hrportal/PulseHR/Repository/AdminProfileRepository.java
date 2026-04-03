package com.hrportal.PulseHR.Repository;

import com.hrportal.PulseHR.Entity.AdminProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminProfileRepository extends JpaRepository<AdminProfile, Long> {

    Optional<AdminProfile> findByUser_Email(String email);
}

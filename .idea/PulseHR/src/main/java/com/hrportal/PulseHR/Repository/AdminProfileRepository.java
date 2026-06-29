package com.hrportal.PulseHR.Repository;

import com.hrportal.PulseHR.Entity.AdminProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AdminProfileRepository extends JpaRepository<AdminProfile, Long> {

    @Query("SELECT ap FROM AdminProfile ap JOIN FETCH ap.user u JOIN FETCH u.roles WHERE ap.user.email = :email")
    Optional<AdminProfile> findByUser_Email(@Param("email") String email);
}

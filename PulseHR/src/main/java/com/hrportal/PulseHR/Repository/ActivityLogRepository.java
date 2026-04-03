package com.hrportal.PulseHR.Repository;

import com.hrportal.PulseHR.Entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    @Query("SELECT a FROM ActivityLog a ORDER BY a.timestamp DESC")
    Page<ActivityLog> findRecentLogs(Pageable pageable);


}


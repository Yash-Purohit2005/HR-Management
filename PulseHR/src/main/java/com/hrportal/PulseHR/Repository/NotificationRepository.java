package com.hrportal.PulseHR.Repository;

import com.hrportal.PulseHR.Entity.Notification;
import com.hrportal.PulseHR.Enums.AudienceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByAudienceIn(List<AudienceType> audiences);
}


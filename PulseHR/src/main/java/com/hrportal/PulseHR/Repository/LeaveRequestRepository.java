package com.hrportal.PulseHR.Repository;

import com.hrportal.PulseHR.Entity.Employee;
import com.hrportal.PulseHR.Entity.LeaveRequest;
import com.hrportal.PulseHR.Enums.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    Page<LeaveRequest> findByEmployee(Employee employee, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END " +
            "FROM LeaveRequest l " +
            "WHERE l.employee.user.username = :username " +  // ✅ correct path
            "AND l.status IN ('PENDING', 'APPROVED') " +
            "AND l.startDate <= :endDate " +
            "AND l.endDate >= :startDate")
    boolean existsByEmployeeAndDateRange(
            @Param("username") String username,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee.id = :employeeId " +
            "AND (LOWER(lr.reason) LIKE %:keyword% OR LOWER(lr.leaveType) LIKE %:keyword%)")
    Page<LeaveRequest> searchByEmployeeAndKeyword(@Param("employeeId") Long employeeId,
                                                  @Param("keyword") String keyword,
                                                  Pageable pageable);



    // Count total by status (for admin)
    long countByStatus(String status);

    // For specific user
    long countByEmployeeAndStatus(Employee employee, LeaveStatus status);

    long countByEmployee(Employee employee);

    @Query("SELECT FUNCTION('MONTH', lr.appliedOn) AS monthNum, " +
            "FUNCTION('MONTHNAME', lr.appliedOn) AS monthName, " +
            "COUNT(lr) AS applied, " +
            "SUM(CASE WHEN lr.status = 'APPROVED' THEN 1 ELSE 0 END) AS approved, " +
            "SUM(CASE WHEN lr.status = 'REJECTED' THEN 1 ELSE 0 END) AS rejected, " +
            "SUM(CASE WHEN lr.status = 'PENDING' THEN 1 ELSE 0 END) AS pending " +
            "FROM LeaveRequest lr " +
            "GROUP BY monthNum, monthName " +
            "ORDER BY monthNum")
    List<Object[]> getMonthlyLeaveTrends();

    @Query("SELECT lr.leaveType, COUNT(lr) FROM LeaveRequest lr GROUP BY lr.leaveType")
    List<Object[]> getLeaveTypeBreakdown();

    @Query("SELECT lr.employee.id, CONCAT(lr.employee.firstName, ' ', lr.employee.lastName), " +
            "COUNT(lr), " +
            "SUM(CASE WHEN lr.status = 'APPROVED' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN lr.status = 'PENDING' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN lr.status = 'REJECTED' THEN 1 ELSE 0 END) " +
            "FROM LeaveRequest lr " +
            "GROUP BY lr.employee.id, lr.employee.firstName, lr.employee.lastName")
    List<Object[]> getEmployeeWiseLeaveStats();


}

package com.hrportal.PulseHR.Repository;

import com.hrportal.PulseHR.Entity.Employee;
import com.hrportal.PulseHR.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Page<Employee> findByActiveTrue(Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE " +
            "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Employee> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT e FROM Employee e " +
            "WHERE (:department IS NULL OR LOWER(e.department) = LOWER(:department)) " +
            "AND (:designation IS NULL OR LOWER(e.designation) = LOWER(:designation)) " +
            "AND (:active IS NULL OR e.active = :active)")
    Page<Employee> filterEmployees(@Param("department") String department,
                                   @Param("designation") String designation,
                                   @Param("active") Boolean active,
                                   Pageable pageable);

    List<Employee> findTop5ByOrderByUpdatedAtDesc();

    @Query("SELECT COUNT(e) FROM Employee e")
    long countTotalEmployees();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.active = true")
    long countActiveEmployees();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.active = false")
    long countInactiveEmployees();

    @Query("SELECT e.department, COUNT(e) FROM Employee e GROUP BY e.department")
    List<Object[]> countByDepartment();

    List<Employee> findByActive(boolean active);

    Optional<Employee> findByUser(User user);

    Optional<Employee> findByUserUsername(String username);
}

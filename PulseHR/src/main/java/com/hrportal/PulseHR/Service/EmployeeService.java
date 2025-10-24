package com.hrportal.PulseHR.Service;

import com.hrportal.PulseHR.DTO.EmployeeDTO;
import com.hrportal.PulseHR.DTO.EmployeeStatsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EmployeeService {
    EmployeeDTO createEmployee(EmployeeDTO employeeDTO);
    EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO);
    void deleteEmployee(Long id);
    EmployeeDTO getEmployeeById(Long id);
    Page<EmployeeDTO> getAllEmployees(Pageable pageable);
    Page<EmployeeDTO> searchEmployees(String keyword, Pageable pageable);
    Page<EmployeeDTO> filterEmployees(String department, String designation, Boolean active, Pageable pageable);
    List<EmployeeDTO> getRecentEmployees();
    EmployeeStatsDTO getEmployeeStatistics();
    Page<EmployeeDTO> getEmployeesSortedByJoiningDate(String direction, Pageable pageable);
    List<EmployeeDTO> getEmployeesByStatus(boolean active);
    void deactivateEmployee(Long id);
    void reactivateEmployee(Long id);
    EmployeeDTO getEmployeeProfileByUsername(String username);

    EmployeeDTO updateEmployeeProfileByUsername(String username, EmployeeDTO updatedDto);
}


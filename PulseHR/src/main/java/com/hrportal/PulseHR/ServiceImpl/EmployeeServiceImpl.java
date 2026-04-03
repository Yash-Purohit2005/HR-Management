package com.hrportal.PulseHR.ServiceImpl;

import com.hrportal.PulseHR.DTO.EmployeeDTO;
import com.hrportal.PulseHR.DTO.EmployeeStatsDTO;
import com.hrportal.PulseHR.Entity.Employee;
import com.hrportal.PulseHR.Entity.User;
import com.hrportal.PulseHR.Exception.EmailAlreadyExistsException;
import com.hrportal.PulseHR.Exception.EmailDeliveryException;
import com.hrportal.PulseHR.Exception.ResourceNotFoundException;
import com.hrportal.PulseHR.Repository.EmployeeRepository;
import com.hrportal.PulseHR.Repository.UserRepository;
import com.hrportal.PulseHR.Service.ActivityLogService;
import com.hrportal.PulseHR.Service.EmployeeService;
import com.hrportal.PulseHR.Utility.EmployeeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
//@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final ActivityLogService activityLogService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,ActivityLogService activityLogService,UserRepository userRepository,PasswordEncoder passwordEncoder,EmailService emailService){
        this.employeeRepository=employeeRepository;
        this.activityLogService=activityLogService;
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
        this.emailService=emailService;
    }

  //  @Override

   // public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {

//// 1. Create User
//
//        User user = new User();
//
//        user.setUsername(employeeDTO.getEmail());
//
//        user.setEmail(employeeDTO.getEmail());
//
//        user.setPassword(passwordEncoder.encode("defaultPassword@123")); // ensure password encoder is injected
//
//        user.setActive(true);
//
//        user.setRoles(Set.of("USER")); // always default for new employees
//
//
//
//        User savedUser = userRepository.save(user);
//
//
//
//// 2. Create Employee linked to User
//
//        Employee employee = EmployeeMapper.toEntity(employeeDTO);
//
//        employee.setUser(savedUser);
//
//
//
//        Employee savedEmployee = employeeRepository.save(employee);
//
//
//
//        return EmployeeMapper.toDTO(savedEmployee);
//
//    }
 // ambk djcs qobb zurl
@Override
@Transactional
public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {

    if (userRepository.existsByEmail(employeeDTO.getEmail())) {
        throw new EmailAlreadyExistsException("An employee with email " + employeeDTO.getEmail() + " already exists.");
    }
    // 1. Create User
    User user = new User();
    user.setUsername(employeeDTO.getEmail());
    user.setEmail(employeeDTO.getEmail());
    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
    user.setActive(true);
    user.setRoles(Set.of("USER"));
    user.setPasswordSet(false);

    // 2. Setup Token Logic
    String setupToken = UUID.randomUUID().toString();
    user.setSetupToken(setupToken);
    user.setSetupTokenExpiry(LocalDateTime.now().plusHours(24));// Fixed Setter


    User savedUser = userRepository.save(user);

    // 3. Create Employee
    Employee employee = EmployeeMapper.toEntity(employeeDTO);
    employee.setUser(savedUser);
    Employee savedEmployee = employeeRepository.save(employee);

    // 4. Send Email
    try {
        emailService.sendWelcomeEmail(
                savedUser.getEmail(),
                savedEmployee.getFirstName(),
                setupToken
        );
    } catch (Exception e) {

        // This triggers @Transactional rollback and the GlobalExceptionHandler
        throw new EmailDeliveryException(
                "Employee account created, but the invitation email failed to send. " +
                        "Please check SMTP settings.", e);
    }

    return EmployeeMapper.toDTO(savedEmployee);
}

    @Override
    public Page<EmployeeDTO> getAllEmployees(Pageable pageable) {
        return employeeRepository.findByActiveTrue(pageable)
                .map(EmployeeMapper::toDTO);
    }

    @Override
    public Page<EmployeeDTO> searchEmployees(String keyword, Pageable pageable) {
        return employeeRepository.searchByKeyword(keyword, pageable).map(EmployeeMapper::toDTO);
    }


    @Override
    public Page<EmployeeDTO> filterEmployees(String department, String designation, Boolean active, Pageable pageable) {
        List<Employee> filtered = employeeRepository.findAll(); // or a custom method
        List<Employee> result = filtered.stream()
                .filter(e -> department == null || e.getDepartment().equalsIgnoreCase(department))
                .filter(e -> designation == null || e.getDesignation().equalsIgnoreCase(designation))
                .filter(e -> active == null || e.isActive() == active)
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), result.size());

        List<EmployeeDTO> paged = result.subList(start, end).stream()
                .map(EmployeeMapper::toDTO)
                .toList();

        return new PageImpl<>(paged, pageable, result.size());
    }

    @Override
    public List<EmployeeDTO> getRecentEmployees() {
        return  employeeRepository.findTop5ByOrderByUpdatedAtDesc()
                .stream()
                .map(EmployeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeStatsDTO getEmployeeStatistics() {
        EmployeeStatsDTO stats = new EmployeeStatsDTO();
        stats.setTotalEmployees(employeeRepository.countTotalEmployees());
        stats.setActiveEmployees(employeeRepository.countActiveEmployees());
        stats.setInactiveEmployees(employeeRepository.countInactiveEmployees());
        stats.setTotalDepartment(employeeRepository.countTotalDepartments());
        // Optional: count by department
        List<Object[]> deptCounts = employeeRepository.countActiveByDepartment();
        System.out.println(deptCounts.size());
        Map<String, Long> deptMap = deptCounts.stream()
                .collect(Collectors.toMap(
                        obj -> (String) obj[0],
                        obj -> (Long) obj[1]
                ));
        stats.setDepartmentCounts(deptMap);

        return stats;
    }

    @Override
    public Page<EmployeeDTO> getEmployeesSortedByJoiningDate(String direction, Pageable pageable) {
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by("joiningDate").descending() :
                Sort.by("joiningDate").ascending();

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        return employeeRepository.findAll(sortedPageable).map(EmployeeMapper::toDTO);
    }

    @Override
    public List<EmployeeDTO> getEmployeesByStatus(boolean active) {
        List<Employee> employees = employeeRepository.findByActive(active);
        return employees.stream().map(EmployeeMapper::toDTO).collect(Collectors.toList());

    }

    @Override
    public void deactivateEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        if (!employee.isActive()) {
            throw new IllegalStateException("Employee is already inactive.");
        }
        employee.setActive(false);
        User user = employee.getUser();
        if (user != null) {
            user.setActive(false);
            userRepository.save(user);
        }

        employeeRepository.save(employee);

    }

    @Override
    public void reactivateEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        if (employee.isActive()) {
            throw new IllegalStateException("Employee is already active.");
        }
        employee.setActive(true);
        User user = employee.getUser();
        if (user != null) {
            user.setActive(true);
            userRepository.save(user);
        }
        employeeRepository.save(employee);


    }


    @Override
    public EmployeeDTO getEmployeeById(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id " + id));
        return EmployeeMapper.toDTO(emp);
    }

    @Override
    public EmployeeDTO updateEmployee( EmployeeDTO employeeDTO) {
        // Fetch the existing employee from DB
        Employee existingEmployee = employeeRepository.findById(employeeDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id " + employeeDTO.getId()));

        // Update the fields
        existingEmployee.setFirstName(employeeDTO.getFirstName());
        existingEmployee.setLastName(employeeDTO.getLastName());
        existingEmployee.setEmail(employeeDTO.getEmail());
        existingEmployee.setPhone(employeeDTO.getPhone());
        existingEmployee.setGender(employeeDTO.getGender());
        existingEmployee.setDepartment(employeeDTO.getDepartment());
        existingEmployee.setDesignation(employeeDTO.getDesignation());
        existingEmployee.setPreviousCompany(employeeDTO.getPreviousCompany());
        existingEmployee.setJoiningDate(employeeDTO.getJoiningDate());
        existingEmployee.setActive(employeeDTO.isActive());

        // Save the updated employee
        Employee updatedEmployee = employeeRepository.save(existingEmployee);
        // Convert back to DTO and return
        return EmployeeMapper.toDTO(updatedEmployee);
    }


    @Override
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id " + id);
        }
        employeeRepository.deleteById(id);
    }

    @Override
    public EmployeeDTO getEmployeeProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Employee employee = employeeRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Employee details not found"));

        return EmployeeMapper.toDTO(employee); // or your existing mapping logic
    }


    @Override
    public EmployeeDTO updateEmployeeProfileByUsername(String username, EmployeeDTO updatedDto) {
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Employee not found for username: " + username));

        // Update allowed fields only
        employee.setFirstName(updatedDto.getFirstName());
        employee.setLastName(updatedDto.getLastName());
        employee.setEmail(updatedDto.getEmail());
        employee.setPhone(updatedDto.getPhone());
        employee = employeeRepository.save(employee);
        return EmployeeMapper.toDTO(employee);
    }




}

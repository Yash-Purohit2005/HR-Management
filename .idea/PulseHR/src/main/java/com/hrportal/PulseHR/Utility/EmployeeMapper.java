package com.hrportal.PulseHR.Utility;

import com.hrportal.PulseHR.DTO.EmployeeDTO;
import com.hrportal.PulseHR.Entity.Employee;

public class EmployeeMapper {

    public static EmployeeDTO toDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setGender(employee.getGender());
        dto.setDepartment(employee.getDepartment());
        dto.setDesignation(employee.getDesignation());
        dto.setPhone(employee.getPhone());
        dto.setPreviousCompany(employee.getPreviousCompany());
        dto.setJoiningDate(employee.getJoiningDate());
        dto.setActive(employee.isActive());

        if (employee.getUser() != null) {
            dto.setUsername(employee.getUser().getUsername());
            dto.setRoles(employee.getUser().getRoles());
        }
        return dto;
    }


    public static Employee toEntity(EmployeeDTO dto) {
        Employee employee = new Employee();
        employee.setId(dto.getId());
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setGender(dto.getGender());
        employee.setDepartment(dto.getDepartment());
        employee.setDesignation(dto.getDesignation());
        employee.setPhone(dto.getPhone());
        employee.setPreviousCompany(dto.getPreviousCompany());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setActive(dto.isActive());
        return employee;
    }
}

// Employee service - will be used for API calls when backend is ready
import { employeesData } from '../data/employeesData';

// Mock API functions - replace with actual API calls later
export const employeeService = {
  // Get all employees
  getAllEmployees: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return employeesData;
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const employee = employeesData.find(emp => emp.id === id);
    if (!employee) {
      throw new Error('Employee not found');
    }
    return employee;
  },

  // Search employees
  searchEmployees: async (searchTerm) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return employeesData.filter((employee) =>
      `${employee.first_name} ${employee.last_name} ${employee.preferred_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }
};

// Future API integration example:
/*
export const employeeService = {
  getAllEmployees: async () => {
    const response = await fetch('/api/employees');
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    return response.json();
  },

  getEmployeeById: async (id) => {
    const response = await fetch(`/api/employees/${id}`);
    if (!response.ok) {
      throw new Error('Employee not found');
    }
    return response.json();
  },

  searchEmployees: async (searchTerm) => {
    const response = await fetch(`/api/employees/search?q=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
      throw new Error('Failed to search employees');
    }
    return response.json();
  }
};
*/

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/timesheet": {
    get: operations["getTimesheets"];
    put: operations["updateTimesheetForId"];
    post: operations["createTimesheet"];
  };
  "/timesheet-entry": {
    get: operations["getTimesheetEntries"];
    put: operations["updateTimesheetEntryForId"];
    post: operations["createTimesheetEntries"];
  };
  "/time-category": {
    get: operations["getAllTimeCategories"];
    put: operations["updateTimeCategoryForId"];
    post: operations["createTimeCategory"];
  };
  "/task": {
    get: operations["getTasks"];
    put: operations["updateTaskForId"];
    post: operations["createTask"];
  };
  "/project": {
    get: operations["getAllProjects"];
    put: operations["updateProjectForId"];
    post: operations["createProject"];
  };
  "/employee": {
    get: operations["getAllEmployees"];
    put: operations["updateEmployeeForId"];
    post: operations["createEmployee"];
  };
  "/customer": {
    get: operations["getAllCustomers"];
    put: operations["updateCustomerForId"];
    post: operations["createCustomer"];
  };
  "/timesheet/{timesheetId}": {
    get: operations["getTimesheetForId"];
    delete: operations["deleteTimesheetForId"];
  };
  "/timesheet-entry/{timesheetEntryId}": {
    get: operations["getTimesheetEntryForId"];
    delete: operations["deleteTimesheetEntryForId"];
  };
  "/timesheet-entry/csv-export": {
    get: operations["exportTimesheetEntriesAsCsv"];
  };
  "/time-category/{timeCategoryId}": {
    get: operations["getTimeCategoryForId"];
    delete: operations["deleteTimeCategoryForId"];
  };
  "/task/{taskId}": {
    get: operations["getTaskForId"];
    delete: operations["deleteTaskForId"];
  };
  "/project/{projectId}": {
    get: operations["getProjectForId"];
    delete: operations["deleteProjectForId"];
  };
  "/employee/{employeeId}": {
    get: operations["getEmployeeForId"];
    delete: operations["deleteEmployeeForId"];
  };
  "/employee/employee-sync": {
    get: operations["syncFirebaseUsers"];
  };
  "/customer/{customerId}": {
    get: operations["getCustomerForId"];
    delete: operations["deleteCustomerForId"];
  };
}

export interface components {
  schemas: {
    CustomerDTO: {
      /** Format: int64 */
      id?: number;
      name: string;
      description?: string;
      /** Format: date-time */
      created?: string;
      /** Format: date-time */
      updated?: string;
      enabled?: boolean;
    };
    EmployeeDTO: {
      /** Format: int64 */
      id?: number;
      firstName: string;
      lastName: string;
      email: string;
      /** Format: date */
      startDate?: string;
      /** Format: date-time */
      created?: string;
      /** Format: date-time */
      updated?: string;
      firebaseUid?: string;
      /** @enum {string} */
      role: "USER" | "ADMIN";
    };
    ProjectDTO: {
      /** Format: int64 */
      id?: number;
      name: string;
      description?: string;
      /** Format: date */
      startDate: string;
      /** Format: date */
      endDate?: string;
      customer: components["schemas"]["CustomerDTO"];
      managingEmployee: components["schemas"]["EmployeeDTO"];
      /** @enum {string} */
      status?: "ACTIVE" | "ARCHIVED";
      /** Format: date-time */
      created?: string;
      /** Format: date-time */
      updated?: string;
    };
    TimesheetDTO: {
      /** Format: int64 */
      id?: number;
      name: string;
      description?: string;
      /** Format: float */
      rate: number;
      /** Format: int32 */
      allocation?: number;
      project: components["schemas"]["ProjectDTO"];
      employee: components["schemas"]["EmployeeDTO"];
      /** Format: date-time */
      created?: string;
      /** Format: date-time */
      updated?: string;
      /** @enum {string} */
      status?: "ACTIVE" | "ARCHIVED";
    };
    TaskDTO: {
      /** Format: int64 */
      id?: number;
      name: string;
      description?: string;
      project: components["schemas"]["ProjectDTO"];
      /** Format: date-time */
      created?: string;
      /** Format: date-time */
      updated?: string;
      billable: boolean;
      /** @enum {string} */
      status?: "ACTIVE" | "ARCHIVED";
    };
    TimeCategoryDTO: {
      /** Format: int64 */
      id?: number;
      name: string;
      description?: string;
      /** Format: date-time */
      created?: string;
      /** Format: date-time */
      updated?: string;
    };
    TimesheetEntryDTO: {
      /** Format: int64 */
      id?: number;
      /** Format: float */
      quantity: number;
      /** Format: date */
      date: string;
      description?: string;
      timesheet: components["schemas"]["TimesheetDTO"];
      timeCategory: components["schemas"]["TimeCategoryDTO"];
      task: components["schemas"]["TaskDTO"];
      /** Format: date-time */
      created?: string;
      /** Format: date-time */
      updated?: string;
    };
  };
}

export interface operations {
  getTimesheets: {
    parameters: {
      query: {
        projectId?: number;
        employeeId?: number;
        email?: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimesheetDTO"][];
        };
      };
    };
  };
  updateTimesheetForId: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimesheetDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TimesheetDTO"];
      };
    };
  };
  createTimesheet: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimesheetDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TimesheetDTO"];
      };
    };
  };
  getTimesheetEntries: {
    parameters: {
      query: {
        timesheetId?: number;
        email?: string;
        startDate?: string;
        endDate?: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimesheetEntryDTO"][];
        };
      };
    };
  };
  updateTimesheetEntryForId: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimesheetEntryDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TimesheetEntryDTO"];
      };
    };
  };
  createTimesheetEntries: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimesheetEntryDTO"][];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TimesheetEntryDTO"][];
      };
    };
  };
  getAllTimeCategories: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimeCategoryDTO"][];
        };
      };
    };
  };
  updateTimeCategoryForId: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimeCategoryDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TimeCategoryDTO"];
      };
    };
  };
  createTimeCategory: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimeCategoryDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TimeCategoryDTO"];
      };
    };
  };
  getTasks: {
    parameters: {
      query: {
        projectId?: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TaskDTO"][];
        };
      };
    };
  };
  updateTaskForId: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TaskDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TaskDTO"];
      };
    };
  };
  createTask: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TaskDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TaskDTO"];
      };
    };
  };
  getAllProjects: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["ProjectDTO"][];
        };
      };
    };
  };
  updateProjectForId: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["ProjectDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ProjectDTO"];
      };
    };
  };
  createProject: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["ProjectDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ProjectDTO"];
      };
    };
  };
  getAllEmployees: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["EmployeeDTO"][];
        };
      };
    };
  };
  updateEmployeeForId: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["EmployeeDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["EmployeeDTO"];
      };
    };
  };
  createEmployee: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["EmployeeDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["EmployeeDTO"];
      };
    };
  };
  getAllCustomers: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["CustomerDTO"][];
        };
      };
    };
  };
  updateCustomerForId: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["CustomerDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CustomerDTO"];
      };
    };
  };
  createCustomer: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["CustomerDTO"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CustomerDTO"];
      };
    };
  };
  getTimesheetForId: {
    parameters: {
      path: {
        timesheetId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimesheetDTO"];
        };
      };
    };
  };
  deleteTimesheetForId: {
    parameters: {
      path: {
        timesheetId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
    };
  };
  getTimesheetEntryForId: {
    parameters: {
      path: {
        timesheetEntryId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimesheetEntryDTO"];
        };
      };
    };
  };
  deleteTimesheetEntryForId: {
    parameters: {
      path: {
        timesheetEntryId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
    };
  };
  exportTimesheetEntriesAsCsv: {
    parameters: {
      query: {
        email?: string;
        startDate: string;
        endDate: string;
      };
    };
    responses: {
      /** OK */
      200: unknown;
    };
  };
  getTimeCategoryForId: {
    parameters: {
      path: {
        timeCategoryId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TimeCategoryDTO"];
        };
      };
    };
  };
  deleteTimeCategoryForId: {
    parameters: {
      path: {
        timeCategoryId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
    };
  };
  getTaskForId: {
    parameters: {
      path: {
        taskId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["TaskDTO"];
        };
      };
    };
  };
  deleteTaskForId: {
    parameters: {
      path: {
        taskId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
    };
  };
  getProjectForId: {
    parameters: {
      path: {
        projectId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["ProjectDTO"];
        };
      };
    };
  };
  deleteProjectForId: {
    parameters: {
      path: {
        projectId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
    };
  };
  getEmployeeForId: {
    parameters: {
      path: {
        employeeId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["EmployeeDTO"];
        };
      };
    };
  };
  deleteEmployeeForId: {
    parameters: {
      path: {
        employeeId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
    };
  };
  syncFirebaseUsers: {
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["EmployeeDTO"][];
        };
      };
    };
  };
  getCustomerForId: {
    parameters: {
      path: {
        customerId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["CustomerDTO"];
        };
      };
    };
  };
  deleteCustomerForId: {
    parameters: {
      path: {
        customerId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
    };
  };
}

export interface external {}

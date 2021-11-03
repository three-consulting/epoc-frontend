/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/timesheet": {
    put: operations["updateTimesheetForId"];
    post: operations["createTimesheet"];
  };
  "/timesheet-entry": {
    put: operations["updateTimesheetEntryForId"];
    post: operations["createTimesheetEntry"];
  };
  "/time-category": {
    get: operations["getAllTimeCategories"];
    put: operations["updateTimeCategoryForId"];
    post: operations["createTimeCategory"];
  };
  "/task": {
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
  "/customer/{customerId}": {
    get: operations["getCustomerForId"];
    delete: operations["deleteCustomerForId"];
  };
}

export interface components {
  schemas: {
    CustomerDTO: {
      id?: number;
      name: string;
      description?: string;
      created?: string;
      updated?: string;
      enabled?: boolean;
    };
    EmployeeDTO: {
      id?: number;
      first_name?: string;
      last_name?: string;
      email?: string;
      start_date?: string;
      created?: string;
      updated?: string;
    };
    ProjectDTO: {
      id?: number;
      name: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      customer?: components["schemas"]["CustomerDTO"];
      managingEmployee?: components["schemas"]["EmployeeDTO"];
      status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
      created?: string;
      updated?: string;
    };
    TimesheetDTO: {
      id?: number;
      name: string;
      description?: string;
      allocation?: number;
      project?: components["schemas"]["ProjectDTO"];
      employee?: components["schemas"]["EmployeeDTO"];
      created?: string;
      updated?: string;
    };
    TaskDTO: {
      id?: number;
      name: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      project?: components["schemas"]["ProjectDTO"];
      created?: string;
      updated?: string;
    };
    TimeCategoryDTO: {
      id?: number;
      name: string;
      description?: string;
      created?: string;
      updated?: string;
    };
    TimesheetEntryDTO: {
      id?: number;
      quantity: {
        seconds?: number;
        nano?: number;
        zero?: boolean;
        negative?: boolean;
        units?: {
          timeBased?: boolean;
          durationEstimated?: boolean;
          duration?: {
            seconds?: number;
            nano?: number;
            zero?: boolean;
            negative?: boolean;
          };
          dateBased?: boolean;
        }[];
      };
      date: string;
      description?: string;
      timesheet?: components["schemas"]["TimesheetDTO"];
      timeCategory?: components["schemas"]["TimeCategoryDTO"];
      task?: components["schemas"]["TaskDTO"];
      created?: string;
      updated?: string;
    };
  };
}

export interface operations {
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
  createTimesheetEntry: {
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

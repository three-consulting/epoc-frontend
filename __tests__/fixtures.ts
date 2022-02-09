import {
    Customer,
    Employee,
    Project,
    Task,
    Timesheet,
} from "@/lib/types/apiTypes"

export const testEmployee: Employee = {
    id: 1,
    firstName: "testi",
    lastName: "tekija",
    email: "test@test.test",
}

export const anotherTestEmployee: Employee = {
    id: 2,
    firstName: "test",
    lastName: "worker",
    email: "test2@test.test",
}

export const testCustomer: Customer = {
    id: 1,
    name: "Some test customer",
    description: "Used in tests.",
}

export const anotherTestCustomer: Customer = {
    id: 2,
    name: "Another test customer",
    description: "Used in tests.",
}

export const testProjectAllFields: Project = {
    name: "Some project",
    description: "Some description",
    startDate: "2022-02-08",
    endDate: "2022-02-09",
    customer: testCustomer,
    managingEmployee: testEmployee,
}

export const testProjectRequiredFields: Project = {
    name: "Some project",
    startDate: "2022-02-08",
    customer: anotherTestCustomer,
    managingEmployee: anotherTestEmployee,
}

export const testProject: Project = {
    id: 1,
    name: "test project",
    startDate: "2022-01-31",
    customer: testCustomer,
    managingEmployee: testEmployee,
}

export const testTimesheetRequiredFields: Timesheet = {
    name: "Name",
    project: testProject,
    employee: testEmployee,
}

export const testTimesheetAllFields: Timesheet = {
    name: "Another name",
    description: "description",
    allocation: 100,
    project: testProject,
    employee: testEmployee,
}

export const testCustomerRequiredFields: Customer = { name: "Name" }

export const testCustomerAllFields: Customer = {
    name: "anotherName",
    description: "description",
}

export const testTimesheet: Timesheet = {
    id: 1,
    name: "Test timesheet",
    project: testProject,
    employee: testEmployee,
}

export const testTaskAllFields: Task = {
    name: "Task name",
    description: "Some description",
    project: testProject,
    billable: false,
}

export const testTaskRequiredFields: Task = {
    name: "Task name",
    project: testProject,
    billable: false,
}

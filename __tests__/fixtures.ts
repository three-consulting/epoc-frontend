import {
    Customer,
    Employee,
    Project,
    Task,
    Timesheet,
    TimesheetEntry,
} from "@/lib/types/apiTypes"

export const testEmployee: Employee = {
    id: 1,
    firstName: "testi",
    lastName: "tekija",
    email: "test@test.test",
    role: "USER",
    firebaseUid: "testUid1",
    status: "ACTIVE",
}

export const anotherTestEmployee: Employee = {
    id: 2,
    firstName: "test",
    lastName: "worker",
    email: "test2@test.test",
    role: "USER",
    firebaseUid: "testUid2",
    status: "ACTIVE",
}

export const thirdTestEmployee: Employee = {
    id: 1,
    firstName: "testi",
    lastName: "tekija",
    email: "test@test.test",
    role: "USER",
    status: "ACTIVE",
}

export const testEmployeeRequiredFields: Employee = {
    firstName: "testi",
    lastName: "tekija",
    email: "test@test.test",
    role: "USER",
    status: "ACTIVE",
}

export const testEmployeeAllFields: Employee = {
    id: 1,
    firstName: "testi",
    lastName: "tekija",
    email: "test@test.test",
    role: "USER",
    firebaseUid: "testUid1",
    status: "ACTIVE",
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

export const thirdTestCustomer: Customer = {
    id: 1,
    name: "third customer",
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
    rate: 100,
    project: testProject,
    employee: testEmployee,
    allocation: 100,
}

export const testTimesheetAllFields: Timesheet = {
    name: "Another name",
    description: "description",
    allocation: 100,
    rate: 100,
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
    rate: 100,
    name: "Test timesheet",
    project: testProject,
    employee: testEmployee,
    allocation: 100,
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

export const testTask: Task = {
    name: "Task name",
    project: testProject,
    billable: false,
    id: 1,
}

export const testChangeTask: Task = {
    name: "Another task name",
    project: testProject,
    billable: true,
    id: 2,
}

export const testTimesheetEntry: TimesheetEntry = {
    id: 1,
    quantity: 2,
    date: "2022-06-09",
    timesheet: testTimesheet,
    task: testChangeTask,
    flex: 3,
}

export const testTimesheetEntryRequiredFields: TimesheetEntry = {
    quantity: 1,
    date: "2022-06-09",
    timesheet: testTimesheet,
    task: testTask,
    flex: 2,
}

export const testTimesheetEntryAllFields: TimesheetEntry = {
    quantity: 1,
    date: "2022-06-09",
    description: "Test description",
    timesheet: testTimesheet,
    task: testTask,
    flex: -2,
}

import { Customer, Employee, Project, Timesheet } from "@/lib/types/apiTypes"

export const testEmployee: Employee = {
    id: 1,
    firstName: "testi",
    lastName: "tekija",
    email: "test@test.test",
}

export const testProject: Project = {
    id: 1,
    name: "test project",
    startDate: "2022-1-31",
    customer: { name: "test customer" } as Customer,
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

import React from "react"
import { Flex, ListItem, UnorderedList } from "@chakra-ui/layout"
import {
    Customer,
    Employee,
    Project,
    Timesheet,
    TimesheetEntry,
} from "@/lib/types/apiTypes"

interface TotalHoursProps {
    startDate: string
    endDate: string
    totalQuantity: number
}

interface CustomerHoursRowProps {
    entries: TimesheetEntry[]
    customer: Customer
    projects: Project[]
}

interface ProjectHoursRowProps {
    entries: TimesheetEntry[]
    project: Project
}

interface EmployeeHoursRowProps {
    entries: TimesheetEntry[]
    employee: Employee
    projects: Project[]
}

interface ReportTableProps {
    entries: TimesheetEntry[]
    customers: Customer[]
    projects: Project[]
    employees: Employee[]
    timesheets: Timesheet[]
    startDate: string
    endDate: string
}

const entriesQuantitySum = (entries: TimesheetEntry[]) =>
    entries.reduce((total, currentItem) => total + currentItem.quantity, 0)

const entriesByProject = (entries: TimesheetEntry[], projectId: number) =>
    entries.filter((entry) => entry.timesheet.project?.id === projectId)

const entriesByCustomer = (entries: TimesheetEntry[], customerId: number) =>
    entries.filter(
        (entry) => entry.timesheet.project.customer?.id === customerId
    )

const entriesByEmployee = (entries: TimesheetEntry[], employeeId: number) =>
    entries.filter((entry) => entry.timesheet.employee?.id === employeeId)

const projectByCustomer = (projects: Project[], customerId: number) =>
    projects.filter((project) => project.customer?.id === customerId)

const projectsByEmployeeTimesheets = (
    timesheets: Timesheet[],
    employeeId: number
) =>
    timesheets
        .filter((timesheet) => timesheet.employee.id === employeeId)
        .map((timesheet) => timesheet.project)

function TotalHours({
    startDate,
    endDate,
    totalQuantity,
}: TotalHoursProps): JSX.Element {
    return totalQuantity > 0 ? (
        <p>
            The total number of hours between {startDate} and {endDate} is{" "}
            {totalQuantity}.
        </p>
    ) : (
        <p>
            No hours between {startDate} and {endDate}.
        </p>
    )
}

function ProjectHoursRow({
    entries,
    project,
}: ProjectHoursRowProps): JSX.Element {
    return (
        <ListItem>
            Total hours for {project.name}: {entriesQuantitySum(entries)}
        </ListItem>
    )
}

function CustomerHoursRow({
    entries,
    customer,
    projects,
}: CustomerHoursRowProps): JSX.Element {
    return (
        <>
            <ListItem>
                Total hours for {customer.name}: {entriesQuantitySum(entries)}
            </ListItem>
            {
                <UnorderedList>
                    {projects.map(
                        (project) =>
                            project.id && (
                                <ProjectHoursRow
                                    entries={entriesByProject(
                                        entries,
                                        project.id
                                    )}
                                    key={`project-hours-row-customer-${project.id}`}
                                    project={project}
                                ></ProjectHoursRow>
                            )
                    )}
                </UnorderedList>
            }
        </>
    )
}

function EmployeeHoursRow({
    entries,
    employee,
    projects,
}: EmployeeHoursRowProps): JSX.Element {
    return (
        <>
            <ListItem>
                Total hours for {employee.firstName} {employee.lastName}:{" "}
                {entriesQuantitySum(entries)}
            </ListItem>
            <UnorderedList>
                {projects.map(
                    (project) =>
                        project.id && (
                            <ProjectHoursRow
                                entries={entriesByProject(entries, project.id)}
                                key={`project-hours-row-employee-${project.id}`}
                                project={project}
                            ></ProjectHoursRow>
                        )
                )}
            </UnorderedList>
        </>
    )
}

function ReportTable({
    entries,
    customers,
    projects,
    timesheets,
    employees,
    startDate,
    endDate,
}: ReportTableProps): JSX.Element {
    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
        >
            <b>Total hours per customer: </b>
            <UnorderedList>
                {customers.map(
                    (customer) =>
                        customer.id && (
                            <CustomerHoursRow
                                key={`customer-hours-row-${customer.id}`}
                                entries={entriesByCustomer(
                                    entries,
                                    customer.id
                                )}
                                customer={customer}
                                projects={projectByCustomer(
                                    projects,
                                    customer.id
                                )}
                            />
                        )
                )}
            </UnorderedList>
            <br></br>
            <b>Total hours per project: </b>
            <UnorderedList>
                {projects.map(
                    (project) =>
                        project.id && (
                            <ProjectHoursRow
                                key={`project-hours-row-${project.id}`}
                                entries={entriesByProject(entries, project.id)}
                                project={project}
                            />
                        )
                )}
            </UnorderedList>
            <br></br>
            <b>Total hours per employee: </b>
            <UnorderedList>
                {employees.map(
                    (employee) =>
                        employee.id && (
                            <EmployeeHoursRow
                                key={`employee-hours-row-${employee.id}`}
                                entries={entriesByEmployee(
                                    entries,
                                    employee.id
                                )}
                                employee={employee}
                                projects={projectsByEmployeeTimesheets(
                                    timesheets,
                                    employee.id
                                )}
                            />
                        )
                )}
            </UnorderedList>
            <br></br>
            <b>Total hours: </b>
            <TotalHours
                startDate={startDate}
                endDate={endDate}
                totalQuantity={entriesQuantitySum(entries)}
            />
        </Flex>
    )
}

export default ReportTable

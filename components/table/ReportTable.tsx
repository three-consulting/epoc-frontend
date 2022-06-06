import React from "react"
import { Flex, ListItem, UnorderedList } from "@chakra-ui/layout"
import {
    Customer,
    Employee,
    Project,
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
}

interface ProjectHoursRowProps {
    entries: TimesheetEntry[]
    project: Project
}

interface EmployeeHoursRowProps {
    entries: TimesheetEntry[]
    employee: Employee
}

interface ReportTableProps {
    entries: TimesheetEntry[]
    customers: Customer[]
    projects: Project[]
    employees: Employee[]
    startDate: string
    endDate: string
}

const entriesQuantitySum = (entries: TimesheetEntry[]) =>
    entries.reduce((total, currentItem) => total + currentItem.quantity, 0)

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

function CustomerHoursRow({
    entries,
    customer,
}: CustomerHoursRowProps): JSX.Element {
    return (
        <ListItem>
            Total hours for {customer.name}: {entriesQuantitySum(entries)}
        </ListItem>
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

function EmployeeHoursRow({
    entries,
    employee,
}: EmployeeHoursRowProps): JSX.Element {
    return (
        <ListItem>
            Total hours for {employee.firstName} {employee.lastName}:{" "}
            {entriesQuantitySum(entries)}
        </ListItem>
    )
}

function ReportTable({
    entries,
    customers,
    projects,
    employees,
    startDate,
    endDate,
}: ReportTableProps): JSX.Element {
    const entriesByCustomer = (
        entriesToFilter: TimesheetEntry[],
        customerId: number
    ) =>
        entriesToFilter.filter(
            (entry) => entry.timesheet.project.customer?.id === customerId
        )
    const entriesByProject = (
        entriesToFilter: TimesheetEntry[],
        projectId: number
    ) =>
        entriesToFilter.filter(
            (entry) => entry.timesheet.project?.id === projectId
        )
    const entriesByEmployee = (
        entriesToFilter: TimesheetEntry[],
        employeeId: number
    ) =>
        entriesToFilter.filter(
            (entry) => entry.timesheet.employee?.id === employeeId
        )
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

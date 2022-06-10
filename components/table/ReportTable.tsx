import React from "react"
import { Flex, ListItem, UnorderedList } from "@chakra-ui/layout"
import {
    Customer,
    Employee,
    Project,
    Task,
    Timesheet,
    TimesheetEntry,
} from "@/lib/types/apiTypes"

interface TotalHoursProps {
    startDate: string
    endDate: string
    totalQuantity: number
}

interface TaskHoursRowProps {
    entries: TimesheetEntry[]
    task: Task
}

interface ProjectHoursRowProps {
    entries: TimesheetEntry[]
    project: Project
    tasks: Task[]
}

interface CustomerHoursRowProps {
    entries: TimesheetEntry[]
    customer: Customer
    projects: Project[]
    tasks: Task[]
}

interface EmployeeHoursRowProps {
    entries: TimesheetEntry[]
    employee: Employee
    projects: Project[]
    tasks: Task[]
}

interface ReportTableProps {
    entries: TimesheetEntry[]
    customers: Customer[]
    projects: Project[]
    employees: Employee[]
    timesheets: Timesheet[]
    tasks: Task[]
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

const entriesByTask = (entries: TimesheetEntry[], taskId: number) =>
    entries.filter((entry) => entry.task.id === taskId)

const taskByProject = (tasks: Task[], projectId: number) =>
    tasks.filter((task) => task.project.id === projectId)

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

function TaskHoursRow({ entries, task }: TaskHoursRowProps): JSX.Element {
    return (
        <ListItem>
            {task.name}: {entriesQuantitySum(entries)}
        </ListItem>
    )
}

function ProjectHoursRow({
    entries,
    project,
    tasks,
}: ProjectHoursRowProps): JSX.Element {
    return (
        <>
            <ListItem>
                {project.name}: {entriesQuantitySum(entries)}
            </ListItem>
            {
                <UnorderedList>
                    {tasks.map(
                        (task) =>
                            task.id && (
                                <TaskHoursRow
                                    entries={entriesByTask(entries, task.id)}
                                    task={task}
                                    key={`task-hours-row-project-${project.id}`}
                                ></TaskHoursRow>
                            )
                    )}
                </UnorderedList>
            }
        </>
    )
}

function CustomerHoursRow({
    entries,
    customer,
    projects,
    tasks,
}: CustomerHoursRowProps): JSX.Element {
    return (
        <>
            <ListItem>
                {customer.name}: {entriesQuantitySum(entries)}
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
                                    tasks={taskByProject(tasks, project.id)}
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
    tasks,
}: EmployeeHoursRowProps): JSX.Element {
    return (
        <>
            <ListItem>
                {employee.firstName} {employee.lastName}:{" "}
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
                                tasks={taskByProject(tasks, project.id)}
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
    tasks,
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
            <div style={{ marginBottom: "20px" }}>
                <b>Hours per customer: </b>
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
                                    tasks={tasks}
                                />
                            )
                    )}
                </UnorderedList>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <b>Hours per employee: </b>
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
                                    tasks={tasks}
                                />
                            )
                    )}
                </UnorderedList>
            </div>
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

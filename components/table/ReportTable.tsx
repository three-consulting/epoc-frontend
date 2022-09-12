import React, { useState } from "react"
import { Flex, ListItem, UnorderedList } from "@chakra-ui/layout"
import {
    Customer,
    Employee,
    Project,
    Task,
    Timesheet,
    TimesheetEntry,
} from "@/lib/types/apiTypes"
import {
    Select,
    Checkbox,
    InputGroup,
    Input,
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
} from "@chakra-ui/react"
import { toLocalDisplayDate } from "@/lib/utils/date"

interface DateInputProps {
    startDate: string
    endDate: string
    setStartDate: React.Dispatch<string>
    setEndDate: React.Dispatch<string>
}

interface TotalHoursProps {
    startDate: string
    endDate: string
    totalQuantity: number
    employeeName?: string
    entries: TimesheetEntry[]
}

interface TaskHoursRowProps {
    entries: TimesheetEntry[]
    task: Task
    displayNull: boolean
}

interface ProjectHoursRowProps {
    entries: TimesheetEntry[]
    project: Project
    tasks: Task[]
    displayNull: boolean
}

interface CustomerHoursRowProps {
    entries: TimesheetEntry[]
    customer: Customer
    projects: Project[]
    tasks: Task[]
    displayNull: boolean
}

interface EmployeeHoursRowProps {
    entries: TimesheetEntry[]
    employee: Employee
    displayNull: boolean
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
    setStartDate: React.Dispatch<string>
    setEndDate: React.Dispatch<string>
}

const entriesQuantitySum = (entries: TimesheetEntry[]) =>
    entries.reduce((total, currentItem) => total + currentItem.quantity, 0)

const totalIncome = (entries: TimesheetEntry[]) =>
    entries.reduce(
        (total, currentItem) =>
            total + currentItem.timesheet.rate * currentItem.quantity,
        0
    )

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

const customersByEmployeeTimesheets = (
    timesheets: Timesheet[],
    employeeId: number
) =>
    timesheets
        .filter((timesheet) => timesheet.employee.id === employeeId)
        .map((timesheet) => timesheet.project.customer)

const entriesByTask = (entries: TimesheetEntry[], taskId: number) =>
    entries.filter((entry) => entry.task.id === taskId)

const taskByProject = (tasks: Task[], projectId: number) =>
    tasks.filter((task) => task.project.id === projectId)

function DateInput({ setStartDate, setEndDate }: DateInputProps): JSX.Element {
    const [newStartDate, setNewStartDate] = useState<string>("")
    const handleStartDateChange = (event: React.FormEvent<HTMLInputElement>) =>
        setNewStartDate(event.currentTarget.value)

    const [newEndDate, setNewEndDate] = useState<string>("")
    const handleEndDateChange = (event: React.FormEvent<HTMLInputElement>) =>
        setNewEndDate(event.currentTarget.value)

    const isInvalid = newEndDate < newStartDate

    const [errorMessage, setErrorMessage] = useState<string>("Invalid dates")

    const handleOnClick = () => {
        if (newEndDate > newStartDate) {
            setStartDate(newStartDate)
            setEndDate(newEndDate)
        } else {
            setErrorMessage("Invalid dates")
            throw Error(errorMessage)
        }
    }

    return (
        <>
            <b>Set time interval</b>
            <InputGroup>
                <FormControl isInvalid={isInvalid}>
                    <Input
                        type={"date"}
                        value={newStartDate}
                        onChange={handleStartDateChange}
                    ></Input>
                    {isInvalid ? (
                        <FormErrorMessage>{errorMessage}</FormErrorMessage>
                    ) : (
                        <FormHelperText>Interval start</FormHelperText>
                    )}
                </FormControl>
                <FormControl isInvalid={isInvalid}>
                    <Input
                        type={"date"}
                        value={newEndDate}
                        onChange={handleEndDateChange}
                    ></Input>
                    {isInvalid ? (
                        <FormErrorMessage>{errorMessage}</FormErrorMessage>
                    ) : (
                        <FormHelperText>Intrerval end</FormHelperText>
                    )}
                </FormControl>
            </InputGroup>
            <div style={{ marginBottom: "10px" }}></div>
            <Button
                colorScheme={"blue"}
                alignSelf={"flex-start"}
                onClick={handleOnClick}
            >
                Search
            </Button>
        </>
    )
}

function Total({
    startDate,
    endDate,
    totalQuantity,
    employeeName,
    entries,
}: TotalHoursProps): JSX.Element {
    return totalQuantity > 0 ? (
        <p>
            The total number of hours {employeeName && `by ${employeeName}`}{" "}
            between {toLocalDisplayDate(startDate)} and{" "}
            {toLocalDisplayDate(endDate)} is {totalQuantity}. The projected
            income in this interval is {totalIncome(entries)}€.
        </p>
    ) : (
        <p>
            No hours between {toLocalDisplayDate(startDate)} and{" "}
            {toLocalDisplayDate(startDate)}.
        </p>
    )
}

const TaskHoursRow = ({
    entries,
    task,
    displayNull,
}: TaskHoursRowProps): JSX.Element =>
    !displayNull || entriesQuantitySum(entries) > 0 ? (
        <>
            <ListItem>
                {task.name}: {entriesQuantitySum(entries)}
            </ListItem>
        </>
    ) : (
        <> </>
    )

const ProjectHoursRow = ({
    entries,
    project,
    tasks,
    displayNull,
}: ProjectHoursRowProps): JSX.Element =>
    !displayNull || entriesQuantitySum(entries) > 0 ? (
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
                                    key={`task-${task.id}-hours-row-project-${project.id}`}
                                    displayNull={displayNull}
                                ></TaskHoursRow>
                            )
                    )}
                </UnorderedList>
            }
        </>
    ) : (
        <> </>
    )

const CustomerHoursRow = ({
    entries,
    customer,
    projects,
    tasks,
    displayNull,
}: CustomerHoursRowProps): JSX.Element =>
    !displayNull || entriesQuantitySum(entries) > 0 ? (
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
                                    displayNull={displayNull}
                                ></ProjectHoursRow>
                            )
                    )}
                </UnorderedList>
            }
        </>
    ) : (
        <> </>
    )

const EmployeeHoursRow = ({
    entries,
    employee,
    displayNull,
}: EmployeeHoursRowProps): JSX.Element =>
    !displayNull || entriesQuantitySum(entries) > 0 ? (
        <>
            <ListItem>
                {employee.firstName} {employee.lastName}:{" "}
                {entriesQuantitySum(entries)}
            </ListItem>
        </>
    ) : (
        <> </>
    )

function ReportTable({
    entries: allEntries,
    customers: allCustomers,
    projects: allProjects,
    employees,
    tasks,
    timesheets,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}: ReportTableProps): JSX.Element {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee>()
    const handleEmployeeChange = (
        event: React.FormEvent<HTMLSelectElement>
    ) => {
        event.preventDefault()
        const id = event.currentTarget.value
        if (id) {
            const employee = employees.find(
                (employeeIterator) => employeeIterator.id === Number(id)
            )
            setSelectedEmployee(employee)
        } else {
            setSelectedEmployee(undefined)
        }
    }
    const [hideNull, setHideNull] = useState<boolean>(true)
    const handleHideNullChange = () => {
        setHideNull((state) => !state)
    }

    const customers = selectedEmployee?.id
        ? customersByEmployeeTimesheets(timesheets, selectedEmployee.id)
        : allCustomers

    const projects = selectedEmployee?.id
        ? projectsByEmployeeTimesheets(timesheets, selectedEmployee.id)
        : allProjects

    const entries = selectedEmployee?.id
        ? entriesByEmployee(allEntries, selectedEmployee.id)
        : allEntries

    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
        >
            <DateInput
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
            ></DateInput>
            <div style={{ marginBottom: "20px" }}></div>
            <Select
                onChange={handleEmployeeChange}
                placeholder="Filter by employee"
                value={selectedEmployee?.id}
                data-testid={"form-field-managing-employee"}
            >
                {employees.map((employee, idx) => (
                    <option key={idx} value={employee.id}>
                        {`${employee.firstName} ${employee.lastName}`}
                    </option>
                ))}
            </Select>
            <div style={{ marginBottom: "10px" }}></div>
            <Checkbox onChange={handleHideNullChange} defaultChecked>
                Hide empty
            </Checkbox>
            <div style={{ marginBottom: "20px" }}></div>
            {
                <div style={{ marginBottom: "20px" }}>
                    <b>Grand total: </b>
                    <Total
                        startDate={startDate}
                        endDate={endDate}
                        totalQuantity={entriesQuantitySum(entries)}
                        employeeName={selectedEmployee?.firstName}
                        entries={entries}
                    />
                </div>
            }
            {!selectedEmployee && (
                <div style={{ marginBottom: "20px" }}>
                    <b>Total hours by employee: </b>
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
                                        displayNull={hideNull}
                                    />
                                )
                        )}
                    </UnorderedList>
                </div>
            )}
            {
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
                                        displayNull={hideNull}
                                    />
                                )
                        )}
                    </UnorderedList>
                </div>
            }
        </Flex>
    )
}

export default ReportTable

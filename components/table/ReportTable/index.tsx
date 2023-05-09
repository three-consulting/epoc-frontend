import React, { useContext, useState } from "react"
import {
    Customer,
    Employee,
    Project,
    Task,
    Timesheet,
} from "@/lib/types/apiTypes"
import { User } from "firebase/auth"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import { dateTimeToShortISODate } from "@/lib/utils/date"
import { DateTime } from "luxon"
import { useTimesheetEntries } from "@/lib/hooks/useList"
import { Role } from "@/lib/types/auth"
import AuthErrorAlert from "@/components/common/AuthErrorAlert"
import ErrorAlert from "@/components/common/ErrorAlert"
import {
    customersByEmployeeTimesheets,
    entriesQuantitySum,
    filterEntries,
    projectsByEmployeeTimesheets,
    taskByProject,
} from "./utils"
import FormSection from "@/components/common/FormSection"
import { Box, Checkbox, FormLabel } from "@chakra-ui/react"
import DateInput from "./DateInput"
import Total from "./Total"
import TableButtons from "./TableButtons"
import FilterFields from "./FilterFields"
import EmployeeHours from "./EmployeeHours"
import CustomerHours from "./CustomerHours"

interface IReportTable {
    customers: Customer[]
    projects: Project[]
    employees: Employee[]
    timesheets: Timesheet[]
    tasks: Task[]
    user: User
}

const ReportTable = ({
    customers: allCustomers,
    projects: allProjects,
    employees,
    tasks: allTasks,
    timesheets,
    user,
}: IReportTable): JSX.Element => {
    const { role } = useContext(AuthContext)

    const firstDay = dateTimeToShortISODate(DateTime.now().startOf("month"))
    const lastDay = dateTimeToShortISODate(DateTime.now().endOf("month"))

    const [startDate, setStartDate] = useState<string | null>(firstDay)
    const [endDate, setEndDate] = useState<string | null>(lastDay)

    const [selectedEmployee, setSelectedEmployee] = useState<Employee>()
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>()
    const [selectedProject, setSelectedProject] = useState<Project>()
    const [selectedTask, setSelectedTask] = useState<Task>()

    const [hide, setHide] = useState<boolean>(true)

    const reportsResponse =
        role === Role.ADMIN && startDate && endDate
            ? useTimesheetEntries(user, startDate, endDate)
            : undefined
    const allEntries = reportsResponse?.isSuccess ? reportsResponse.data : []

    const customers = selectedEmployee?.id
        ? customersByEmployeeTimesheets(timesheets, selectedEmployee.id)
        : allCustomers

    const projects = selectedEmployee?.id
        ? projectsByEmployeeTimesheets(timesheets, selectedEmployee.id)
        : allProjects

    const tasks = selectedProject?.id
        ? taskByProject(allTasks, selectedProject.id)
        : allTasks

    const entries = filterEntries(
        allEntries,
        selectedEmployee,
        selectedProject,
        selectedCustomer,
        selectedTask
    )

    const handleHideNullChange = () => {
        setHide((state) => !state)
    }

    if (!reportsResponse) {
        return <AuthErrorAlert />
    }

    if (reportsResponse.isError) {
        return <ErrorAlert message={reportsResponse.errorMessage} />
    }

    return (
        <FormSection header="Reports">
            <DateInput
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                user={user}
            />
            <FilterFields
                employees={employees}
                customers={customers}
                projects={projects}
                tasks={tasks}
                employeeState={[selectedEmployee, setSelectedEmployee]}
                customerState={[selectedCustomer, setSelectedCustomer]}
                projcetState={[selectedProject, setSelectedProject]}
                taskState={[selectedTask, setSelectedTask]}
            />
            <Box paddingY="1rem">
                <Checkbox onChange={handleHideNullChange} defaultChecked>
                    Hide empty
                </Checkbox>
            </Box>
            <Box paddingY="1rem">
                <FormLabel fontWeight="bold">Grand total: </FormLabel>
                <Total
                    startDate={startDate}
                    endDate={endDate}
                    totalQuantity={entriesQuantitySum(entries)}
                    employeeName={selectedEmployee?.firstName}
                    entries={entries}
                />
            </Box>
            <EmployeeHours
                entries={entries}
                selectedEmployee={selectedEmployee}
                employees={employees}
                hide={hide}
            />
            <CustomerHours
                entries={entries}
                selectedCustomer={selectedCustomer}
                selectedProject={selectedProject}
                selectedTask={selectedTask}
                customers={customers}
                projects={projects}
                tasks={tasks}
                hide={hide}
            />
            <Box paddingY="1rem">
                <TableButtons
                    startDate={startDate}
                    endDate={endDate}
                    selectedEmployee={selectedEmployee}
                    selectedProject={selectedProject}
                    selectedCustomer={selectedCustomer}
                    selectedTask={selectedTask}
                    user={user}
                />
            </Box>
        </FormSection>
    )
}

export default ReportTable

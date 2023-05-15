import { Customer, Employee, Project, Task } from "@/lib/types/apiTypes"
import { Box, FormLabel, Select } from "@chakra-ui/react"
import React, { Dispatch, SetStateAction } from "react"

type TSetter<T> = Dispatch<SetStateAction<T>>
type TState<T> = [T | undefined, TSetter<T | undefined>]

interface IFilterFields {
    employees: Array<Employee>
    customers: Array<Customer>
    projects: Array<Project>
    tasks: Array<Task>
    employeeState: TState<Employee>
    customerState: TState<Customer>
    projcetState: TState<Project>
    taskState: TState<Task>
}

const FilterFields = ({
    employees,
    customers,
    projects,
    tasks,
    employeeState,
    customerState,
    projcetState,
    taskState,
}: IFilterFields) => {
    const [selectedEmployee, setSelectedEmployee] = employeeState
    const [selectedCustomer, setSelectedCustomer] = customerState
    const [selectedProject, setSelectedProject] = projcetState
    const [selectedTask, setSelectedTask] = taskState

    const handleEmployeeChange = (
        event: React.FormEvent<HTMLSelectElement>
    ) => {
        event.preventDefault()
        setSelectedEmployee(
            employees.find(
                (emp) => emp.id === Number(event.currentTarget.value)
            )
        )
    }

    const handleCustomerChange = (
        event: React.FormEvent<HTMLSelectElement>
    ) => {
        event.preventDefault()
        setSelectedCustomer(
            customers.find(
                (cst) => cst.id === Number(event.currentTarget.value)
            )
        )
    }

    const handleProjectChange = (event: React.FormEvent<HTMLSelectElement>) => {
        event.preventDefault()
        setSelectedProject(
            projects.find((prj) => prj.id === Number(event.currentTarget.value))
        )
    }

    const handleTaskChange = (event: React.FormEvent<HTMLSelectElement>) => {
        event.preventDefault()
        setSelectedTask(
            tasks.find((tsk) => tsk.id === Number(event.currentTarget.value))
        )
    }
    return (
        <Box display="flex" justifyContent="space-between">
            <Box marginRight="1rem">
                <FormLabel fontWeight="bold">Filter by employee: </FormLabel>
                <Select
                    onChange={handleEmployeeChange}
                    value={selectedEmployee?.id || ""}
                    data-testid={"form-field-managing-employee"}
                >
                    {employees.map((employee, idx) => (
                        <option key={idx} value={employee.id}>
                            {`${employee.firstName ?? " - "} ${
                                employee.lastName ?? " - "
                            }`}
                        </option>
                    ))}
                    <option value="" />
                </Select>
            </Box>
            <Box marginX="1rem">
                <FormLabel fontWeight="bold">Filter by customer: </FormLabel>
                <Select
                    onChange={handleCustomerChange}
                    value={selectedCustomer?.id || ""}
                    data-testid={"form-field-managing-customer"}
                >
                    {customers.map((customer, idx) => (
                        <option key={idx} value={customer.id}>
                            {`${customer.name ?? " - "}`}
                        </option>
                    ))}
                    <option value="" />
                </Select>
            </Box>
            <Box marginX="1rem">
                <FormLabel fontWeight="bold">Filter by project: </FormLabel>
                <Select
                    onChange={handleProjectChange}
                    value={selectedProject?.id || ""}
                    defaultValue={""}
                    data-testid={"form-field-managing-project"}
                >
                    {projects.map((project, idx) => (
                        <option key={idx} value={project.id}>
                            {`${project.name ?? " - "}`}
                        </option>
                    ))}
                    <option value="" />
                </Select>
            </Box>
            <Box marginLeft="1rem">
                <FormLabel fontWeight="bold">Filter by task: </FormLabel>
                <Select
                    onChange={handleTaskChange}
                    value={selectedTask?.id || ""}
                    defaultValue={""}
                    data-testid={"form-field-managing-task"}
                >
                    {tasks.map((task, idx) => (
                        <option key={idx} value={task.id}>
                            {`${task.name ?? " - "}`}
                        </option>
                    ))}
                    <option value="" />
                </Select>
            </Box>
        </Box>
    )
}
export default FilterFields

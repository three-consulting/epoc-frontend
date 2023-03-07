import React from "react"
import { ListItem, UnorderedList } from "@chakra-ui/layout"
import {
    Customer,
    Employee,
    Project,
    Task,
    TimesheetEntry,
} from "@/lib/types/apiTypes"
import {
    entriesByProject,
    entriesByTask,
    entriesQuantitySum,
    taskByProject,
} from "./utils"

interface ITaskHoursRow {
    entries: TimesheetEntry[]
    task: Task
    displayNull: boolean
}

interface IProjectHoursRow {
    entries: TimesheetEntry[]
    project: Project
    tasks: Task[]
    displayNull: boolean
}

interface ICustomerHoursRow {
    entries: TimesheetEntry[]
    customer: Customer
    projects: Project[]
    tasks: Task[]
    displayNull: boolean
}

interface IEmployeeHoursRow {
    entries: TimesheetEntry[]
    employee: Employee
    displayNull: boolean
}

const TaskHoursRow = ({
    entries,
    task,
    displayNull,
}: ITaskHoursRow): JSX.Element => {
    const quantitySum = entriesQuantitySum(entries)
    const show = !displayNull || quantitySum > 0

    return (
        <>
            {show && (
                <ListItem>
                    {task.name}: {quantitySum}
                </ListItem>
            )}
        </>
    )
}

const ProjectHoursRow = ({
    entries,
    project,
    tasks,
    displayNull,
}: IProjectHoursRow): JSX.Element => {
    const quantitySum = entriesQuantitySum(entries)
    const show = !displayNull || quantitySum > 0

    return (
        <>
            {show && (
                <>
                    <ListItem>
                        {project.name}: {quantitySum}
                    </ListItem>
                    {
                        <UnorderedList>
                            {tasks.map(
                                (task) =>
                                    task.id && (
                                        <TaskHoursRow
                                            entries={entriesByTask(
                                                entries,
                                                task.id
                                            )}
                                            task={task}
                                            key={`task-${task.id}-hours-row-project-${project.id}`}
                                            displayNull={displayNull}
                                        />
                                    )
                            )}
                        </UnorderedList>
                    }
                </>
            )}
        </>
    )
}

export const CustomerHoursRow = ({
    entries,
    customer,
    projects,
    tasks,
    displayNull,
}: ICustomerHoursRow): JSX.Element => {
    const quantitySum = entriesQuantitySum(entries)
    const show = !displayNull || quantitySum > 0

    return (
        <>
            {show && (
                <>
                    <ListItem>
                        {customer.name}: {quantitySum}
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
                                            tasks={taskByProject(
                                                tasks,
                                                project.id
                                            )}
                                            displayNull={displayNull}
                                        />
                                    )
                            )}
                        </UnorderedList>
                    }
                </>
            )}
        </>
    )
}

export const EmployeeHoursRow = ({
    entries,
    employee,
    displayNull,
}: IEmployeeHoursRow): JSX.Element => {
    const quantitySum = entriesQuantitySum(entries)
    const show = !displayNull || quantitySum > 0

    return (
        <>
            {show && (
                <ListItem>
                    {employee.firstName} {employee.lastName}: {quantitySum}
                </ListItem>
            )}
        </>
    )
}

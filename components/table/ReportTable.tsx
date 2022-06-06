import React from "react"
import { Flex, ListItem, UnorderedList } from "@chakra-ui/layout"
import { Customer, Project, TimesheetEntry } from "@/lib/types/apiTypes"

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

interface ReportTableProps {
    entries: TimesheetEntry[]
    customers: Customer[]
    projects: Project[]
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

function ReportTable({
    entries,
    customers,
    projects,
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

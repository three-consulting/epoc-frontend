import React from "react"
import { Box, FormLabel, UnorderedList } from "@chakra-ui/react"
import { CustomerHoursRow } from "./RowComponents"
import { Customer, Project, Task, TimesheetEntry } from "@/lib/types/apiTypes"
import { entriesByCustomer, projectByCustomer } from "./utils"

interface ICustomerHours {
    entries: Array<TimesheetEntry>
    selectedCustomer?: Customer
    selectedProject?: Project
    selectedTask?: Task
    customers: Array<Customer>
    projects: Array<Project>
    tasks: Array<Task>
    hide: boolean
}

const CustomerHours = ({
    entries,
    selectedCustomer,
    selectedProject,
    selectedTask,
    customers,
    projects,
    tasks,
    hide,
}: ICustomerHours) => (
    <Box paddingY="1rem">
        <FormLabel fontWeight="bold">{"Hours per customer: "}</FormLabel>
        <UnorderedList>
            {selectedCustomer?.id ? (
                <CustomerHoursRow
                    key={`customer-hours-row-${selectedCustomer.id}`}
                    entries={entriesByCustomer(entries, selectedCustomer.id)}
                    customer={selectedCustomer}
                    projects={projectByCustomer(
                        selectedProject ? [selectedProject] : projects,
                        selectedCustomer.id
                    )}
                    tasks={selectedTask ? [selectedTask] : tasks}
                    displayNull={hide}
                />
            ) : (
                customers.map(
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
                                    selectedProject
                                        ? [selectedProject]
                                        : projects,
                                    customer.id
                                )}
                                tasks={selectedTask ? [selectedTask] : tasks}
                                displayNull={hide}
                            />
                        )
                )
            )}
        </UnorderedList>
    </Box>
)

export default CustomerHours

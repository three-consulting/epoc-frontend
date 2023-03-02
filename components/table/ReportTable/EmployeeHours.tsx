import { Employee, TimesheetEntry } from "@/lib/types/apiTypes"
import { Box, FormLabel, UnorderedList } from "@chakra-ui/react"
import React from "react"
import { EmployeeHoursRow } from "./RowComponents"
import { entriesByEmployee } from "./utils"

interface IEmployeeHours {
    entries: Array<TimesheetEntry>
    selectedEmployee?: Employee
    employees: Array<Employee>
    hide: boolean
}

const EmployeeHours = ({
    entries,
    selectedEmployee,
    employees,
    hide,
}: IEmployeeHours): JSX.Element => (
    <Box paddingY="1rem">
        <FormLabel fontWeight="bold">{"Total hours by employee: "}</FormLabel>
        <UnorderedList>
            {selectedEmployee?.id ? (
                <EmployeeHoursRow
                    key={`employee-hours-row-${selectedEmployee.id}`}
                    entries={entriesByEmployee(entries, selectedEmployee.id)}
                    employee={selectedEmployee}
                    displayNull={hide}
                />
            ) : (
                employees.map(
                    (employee) =>
                        employee.id && (
                            <EmployeeHoursRow
                                key={`employee-hours-row-${employee.id}`}
                                entries={entriesByEmployee(
                                    entries,
                                    employee.id
                                )}
                                employee={employee}
                                displayNull={hide}
                            />
                        )
                )
            )}
        </UnorderedList>
    </Box>
)

export default EmployeeHours

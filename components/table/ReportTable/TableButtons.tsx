import React from "react"
import { CustomButton } from "@/components/common/Buttons"
import FormButtons from "@/components/common/FormButtons"
import { useTimesheetEntries } from "@/lib/hooks/useList"
import {
    filterEntries,
    handleCsvExportClick,
    handlePdfExportClick,
} from "./utils"
import { Customer, Employee, Project, Task } from "@/lib/types/apiTypes"
import { User } from "firebase/auth"

interface ITableButtons {
    startDate: string
    endDate: string
    selectedEmployee?: Employee
    selectedCustomer?: Customer
    selectedProject?: Project
    selectedTask?: Task
    user: User
}

const TableButtons = ({
    startDate,
    endDate,
    selectedEmployee,
    selectedCustomer,
    selectedProject,
    selectedTask,
    user,
}: ITableButtons): JSX.Element => {
    const timesheetsEntries = useTimesheetEntries(
        user,
        startDate,
        endDate,
        selectedEmployee?.email
    )

    const filteredEntries = timesheetsEntries.isSuccess
        ? filterEntries(
              timesheetsEntries.data,
              selectedEmployee,
              selectedProject,
              selectedCustomer,
              selectedTask
          )
        : []

    const isInvalid =
        filteredEntries.length < 1 ||
        endDate < startDate ||
        !endDate ||
        !startDate

    return (
        <FormButtons>
            <CustomButton
                text="Export as .csv"
                colorScheme="green"
                onClick={() =>
                    handleCsvExportClick(user, startDate, endDate, {
                        employee: selectedEmployee,
                        project: selectedProject,
                        customer: selectedCustomer,
                        task: selectedTask,
                    })
                }
                disabled={isInvalid}
            />
            <CustomButton
                text="Export as .pdf"
                colorScheme="green"
                onClick={() =>
                    handlePdfExportClick(
                        filteredEntries,
                        startDate,
                        endDate,
                        selectedEmployee
                    )
                }
                disabled={isInvalid}
            />
        </FormButtons>
    )
}

export default TableButtons

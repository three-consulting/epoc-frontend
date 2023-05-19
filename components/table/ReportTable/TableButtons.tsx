import React from "react"
import { CustomButton } from "@/components/common/Buttons"
import StyledButtons from "@/components/common/StyledButtons"
import { useTimesheetEntries } from "@/lib/hooks/useList"
import {
    filterEntries,
    handleCsvExportClick,
    handlePdfExportClick,
} from "./utils"
import {
    Customer,
    Employee,
    Project,
    Task,
    TimesheetEntry,
} from "@/lib/types/apiTypes"
import { User } from "firebase/auth"
import { ApiGetResponse } from "@/lib/types/hooks"

interface ITableButtons {
    startDate: string | null
    endDate: string | null
    selectedEmployee?: Employee
    selectedCustomer?: Customer
    selectedProject?: Project
    selectedTask?: Task
    user: User
}

type TTEResponse = ApiGetResponse<TimesheetEntry[]>

type TUnsuccess = {
    isSuccess: false
}

const unSuccess: TUnsuccess = {
    isSuccess: false,
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
    const timesheetsEntries: TTEResponse | TUnsuccess =
        startDate && endDate
            ? useTimesheetEntries(
                  user,
                  startDate,
                  endDate,
                  selectedEmployee?.email
              )
            : unSuccess

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
        !startDate ||
        !endDate ||
        filteredEntries.length < 1 ||
        endDate < startDate

    return (
        <StyledButtons>
            <CustomButton
                text="Export as .csv"
                colorScheme="green"
                onClick={() =>
                    startDate &&
                    endDate &&
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
                    startDate &&
                    endDate &&
                    handlePdfExportClick(
                        filteredEntries,
                        startDate,
                        endDate,
                        selectedEmployee
                    )
                }
                disabled={isInvalid}
            />
        </StyledButtons>
    )
}

export default TableButtons

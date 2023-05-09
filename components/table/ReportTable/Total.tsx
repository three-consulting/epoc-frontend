import { TimesheetEntry } from "@/lib/types/apiTypes"
import { toLocalDisplayDate } from "@/lib/utils/date"
import { round } from "lodash"
import React from "react"
import { totalIncome } from "./utils"

interface ITotalHours {
    startDate: string | null
    endDate: string | null
    totalQuantity: number
    employeeName?: string
    entries: TimesheetEntry[]
}

const Total = ({
    startDate,
    endDate,
    totalQuantity,
    employeeName,
    entries,
}: ITotalHours): JSX.Element =>
    totalQuantity > 0 ? (
        <p>
            The total number of hours {employeeName && `by ${employeeName}`}{" "}
            between {startDate ? toLocalDisplayDate(startDate) : "-"} and{" "}
            {endDate ? toLocalDisplayDate(endDate) : "-"} is{" "}
            {round(totalQuantity, 2)}. The projected income in this interval is{" "}
            {totalIncome(entries)}€.
        </p>
    ) : (
        <p>
            No hours between {startDate ? toLocalDisplayDate(startDate) : "-"}{" "}
            and {startDate ? toLocalDisplayDate(startDate) : "-"}.
        </p>
    )

export default Total

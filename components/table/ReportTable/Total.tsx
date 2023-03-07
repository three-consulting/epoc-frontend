import { TimesheetEntry } from "@/lib/types/apiTypes"
import { toLocalDisplayDate } from "@/lib/utils/date"
import { round } from "lodash"
import React from "react"
import { totalIncome } from "./utils"

interface ITotalHours {
    startDate: string
    endDate: string
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
            between {toLocalDisplayDate(startDate)} and{" "}
            {toLocalDisplayDate(endDate)} is {round(totalQuantity, 2)}. The
            projected income in this interval is {totalIncome(entries)}€.
        </p>
    ) : (
        <p>
            No hours between {toLocalDisplayDate(startDate)} and{" "}
            {toLocalDisplayDate(startDate)}.
        </p>
    )

export default Total

import { TimesheetEntry } from "@/lib/types/apiTypes"
import { round, sum } from "lodash"
import React from "react"
import { DateTime } from "luxon"

interface IWeeklyHours {
    entries: TimesheetEntry[]
    dates: [Date] | [Date, Date]
}

export const WeeklyHours = ({ entries, dates }: IWeeklyHours): JSX.Element => {
    const total = sum(
        entries
            .filter(
                (entry) =>
                    DateTime.fromISO(entry.date) <=
                        DateTime.fromJSDate(dates[0]).endOf("week") &&
                    DateTime.fromISO(entry.date) >=
                        DateTime.fromJSDate(dates[0]).startOf("week")
            )
            .map((item) => item.quantity)
    )

    return (
        <p>
            Hours this week: <b>{round(total, 2)}</b>
        </p>
    )
}

interface IMonthlyHours {
    entries: TimesheetEntry[]
    dates: [Date] | [Date, Date]
}

export const MonthlyHours = ({
    entries,
    dates,
}: IMonthlyHours): JSX.Element => {
    const total = sum(
        entries
            .filter(
                (entry) =>
                    DateTime.fromISO(entry.date) <=
                        DateTime.fromJSDate(dates[0]).endOf("month") &&
                    DateTime.fromISO(entry.date) >=
                        DateTime.fromJSDate(dates[0]).startOf("month")
            )
            .map((item) => item.quantity)
    )
    return (
        <p>
            Hours this month: <b>{round(total, 2)}</b>
        </p>
    )
}

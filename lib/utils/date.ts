import { DateTime } from "luxon"

export const toLocalDisplayDate = (date: string) =>
    DateTime.fromISO(date).toLocaleString()

export const jsDateToShortISODate = (date: Date) =>
    DateTime.fromJSDate(date).toISO().replace(/T.*/, "")

export const dateTimeToShortISODate = (dateTime: DateTime) =>
    dateTime.toISO().replace(/T.*/, "")

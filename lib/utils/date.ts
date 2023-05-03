import { DateTime } from "luxon"

export const toLocalDisplayDate = (date: string) =>
    DateTime.fromISO(date).toLocaleString()

export const jsDateToShortISODate = (date: Date | null): string | null => {
    if (date) {
        const dtm = DateTime.fromJSDate(date).toISO()

        if (dtm) {
            return dtm.replace(/T.*/, "")
        }
        return dtm
    }
    return date
}

export const dateTimeToShortISODate = (dateTime: DateTime): string | null => {
    const iso = dateTime.toISO()
    if (iso) {
        return iso.replace(/T.*/, "")
    }
    return iso
}

export const isDates = (dates: unknown): dates is [Date, Date] =>
    Array.isArray(dates) &&
    dates.length === 2 &&
    dates[0] !== null &&
    dates[1] !== null

export const isDate = (dates: unknown): dates is [Date] =>
    Array.isArray(dates) && dates.length === 1 && dates[0] !== null

export const isNullableDates = (
    dates: unknown
): dates is [Date | null, Date | null] =>
    Array.isArray(dates) && dates.length === 2

export const isNullableDate = (
    dates: unknown
): dates is [Date] | [Date, null] =>
    Array.isArray(dates) &&
    ((dates.length === 1 && dates[0] !== null) ||
        (dates.length === 2 && dates[0] !== null && dates[1] === null))

export const datesValue = (
    dates: unknown
): Date | [Date | null, Date | null] => {
    if (isNullableDates(dates)) {
        return dates
    }
    if (isNullableDate(dates)) {
        return dates[0]
    }
    return new Date()
}

export const datesRange = (dates: unknown): [Date] | [Date, Date] =>
    isDates(dates) || isDate(dates) ? dates : [new Date()]

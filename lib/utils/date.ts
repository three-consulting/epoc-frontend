import { DateTime } from "luxon"

export const toLocalDisplayDate = (date: string) =>
    DateTime.fromISO(date).toLocaleString()

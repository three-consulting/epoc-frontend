import { ApiGetResponse } from "../types/hooks"
import { NEXT_PUBLIC_GOOGLE_APIKEY } from "../conf"
import { useGet } from "./swrInterface"
import { DateTime } from "luxon"
import { yyyymmddToDateTime } from "../utils/common"

export const dateIsHoliday = (datetime: DateTime, holidays: Holiday[]) =>
    datetime.weekday === 6 ||
    datetime.weekday === 7 ||
    holidays.find(({ date }) => date.equals(datetime))

export type Holiday = {
    date: DateTime
    description: string
    summary: string
}

type IData = {
    start: {
        date: string
    }
} & Holiday

type Response = {
    items: IData[]
}

const GOOGLE_API_URL =
    "www.googleapis.com/calendar/v3/calendars/fi.finnish%23holiday%40group.v.calendar.google.com"
const url = `https://${GOOGLE_API_URL}/events`

const parseEvents = (items: IData[]): Holiday[] =>
    items.map(({ start, description, summary }) => ({
        date: yyyymmddToDateTime(start.date),
        description,
        summary,
    }))

export const useHoliday = (): ApiGetResponse<Holiday[]> => {
    const response = useGet<Response>(url, [], undefined, {
        key: NEXT_PUBLIC_GOOGLE_APIKEY,
    })

    if (response.isSuccess) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { items } = response.data
        const holidays = parseEvents(items)
        return { ...response, data: holidays }
    }
    return response
}

export default useHoliday

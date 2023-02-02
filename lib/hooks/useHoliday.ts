import { useEffect, useState } from "react"
import { ApiGetResponse } from "../types/hooks"
import { NEXT_PUBLIC_GOOGLE_APIKEY } from "../conf"

type Holiday = {
    date: string
    description: string
    summary: string
}

interface IData extends Holiday {
    start: {
        date: string
    }
}

function parseEvents(data: { items: IData[] }): Holiday[] {
    const { items } = data
    const holidays = []
    for (const item of items) {
        const { date } = item.start
        const { description } = item
        const { summary } = item
        holidays.push({ date, description, summary })
    }
    return holidays
}

export const useHoliday = (): ApiGetResponse<Holiday[]> => {
    const GOOGLE_API_URL =
        "www.googleapis.com/calendar/v3/calendars/fi.finnish%23holiday%40group.v.calendar.google.com"
    const [response, setResponse] = useState<ApiGetResponse<Holiday[]>>({
        isSuccess: false,
        isLoading: true,
        isError: false,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiResponse = await fetch(
                    `https://${GOOGLE_API_URL}/events?key=${NEXT_PUBLIC_GOOGLE_APIKEY}`
                )
                const data = await apiResponse.json()
                const parsedData = parseEvents(data)
                setResponse({
                    isSuccess: true,
                    isLoading: false,
                    isError: false,
                    data: parsedData,
                })
            } catch (error) {
                setResponse({
                    isSuccess: false,
                    isLoading: false,
                    isError: true,
                    errorMessage: "Error",
                })
            }
        }

        fetchData()
    }, [])

    return response
}

export default useHoliday

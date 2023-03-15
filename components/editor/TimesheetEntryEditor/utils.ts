import { Task } from "@/lib/types/apiTypes"
import { Dispatch, SetStateAction } from "react"

export type TSetState<T> = Dispatch<SetStateAction<T>>

export const getDatesFromRange = (
    range: [Date] | [Date, Date]
): Array<Date> => {
    const [start, end] = range
    if (!end) {
        return [start]
    }
    const rangeLength = end.getDate() - start.getDate()
    const dates: Array<Date> = []

    for (let i = 0; i <= rangeLength; i++) {
        const date = new Date(start)
        date.setDate(start.getDate() + i)
        dates.push(date)
    }

    return dates
}

export const taskByProject = (tasks: Task[], projectId: number) =>
    tasks.filter((task) => task.project.id === projectId)

import React from "react"
import { Flex } from "@chakra-ui/layout"
import { TimesheetEntry } from "@/lib/types/apiTypes"

interface TotalHoursProps {
    startDate: string
    endDate: string
    totalQuantity: number
}

interface ReportTableProps {
    entries: TimesheetEntry[]
    startDate: string
    endDate: string
}

function TotalHours({
    startDate,
    endDate,
    totalQuantity,
}: TotalHoursProps): JSX.Element {
    return totalQuantity > 0 ? (
        <p>
            The total number of hours between {startDate} and {endDate} is{" "}
            {totalQuantity}.
        </p>
    ) : (
        <p>
            No hours between {startDate} and {endDate}.
        </p>
    )
}

function ReportTable({
    entries,
    startDate,
    endDate,
}: ReportTableProps): JSX.Element {
    const totalQuantity = entries.reduce(
        (total, currentItem) => total + currentItem.quantity,
        0
    )

    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
        >
            <b>Total hours: </b>
            <TotalHours
                startDate={startDate}
                endDate={endDate}
                totalQuantity={totalQuantity}
            />
        </Flex>
    )
}

export default ReportTable

import { TimesheetEntry } from "@/lib/types/apiTypes"
import _, { sum, join } from "lodash"
import { Box, Icon, Tooltip, useOutsideClick } from "@chakra-ui/react"
import React, { useRef } from "react"
import Calendar, {
    CalendarTileProperties,
    ViewCallbackProperties,
} from "react-calendar"
import { jsDateToShortISODate } from "@/lib/utils/date"
import useHoliday from "@/lib/hooks/useHoliday"
import { BsSunglasses } from "react-icons/bs"

interface TimesheetEntryEditorProps {
    entries: TimesheetEntry[]
    selectedDate: Date | undefined
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    dateUnderEdit: Date | undefined
    setDateUnderEdit: React.Dispatch<React.SetStateAction<Date | undefined>>
}

const TimesheetEntryEditor = ({
    entries,
    selectedDate,
    setSelectedDate,
    dateUnderEdit,
    setDateUnderEdit,
}: TimesheetEntryEditorProps): JSX.Element => {
    const holidaysObject = useHoliday()

    const onYearOrMonthChange = ({
        activeStartDate,
    }: ViewCallbackProperties) => {
        setSelectedDate(activeStartDate)
    }

    const onDatesChange = (newDates: Date) => {
        if (selectedDate && _.isEqual(selectedDate, newDates)) {
            setDateUnderEdit(selectedDate)
        }
        setSelectedDate(newDates)
    }

    const matchDates = (thisDate: Date) => {
        if (holidaysObject.isSuccess) {
            if (
                holidaysObject.data.some(
                    (item) =>
                        item.date === jsDateToShortISODate(thisDate) &&
                        item.description === "Yleinen vapaapäivä"
                )
            ) {
                return true
            }
        }
        return false
    }

    const entryDates = entries.map(({ date: entryDate }) => entryDate)

    const ref = useRef(null)
    useOutsideClick({
        ref,
        handler: () => {
            if (!dateUnderEdit) {
                setSelectedDate(undefined)
            }
        },
    })

    return (
        <Box flexDirection="column" alignItems="center" width="100%" ref={ref}>
            <Calendar
                onChange={onDatesChange}
                returnValue={"start"}
                allowPartialRange={true}
                onActiveStartDateChange={onYearOrMonthChange}
                value={selectedDate || null}
                tileClassName={({ date: thisDate }) => {
                    const classNames = []
                    const iso = jsDateToShortISODate(thisDate)
                    if (matchDates(thisDate)) {
                        classNames.push(
                            "react-calendar__month-view__public_holidays"
                        )
                    }
                    if (iso && entryDates.includes(iso)) {
                        classNames.push("react-calendar__tile--completed")
                    }
                    return classNames.join(" ")
                }}
                tileContent={({ date: d, view }: CalendarTileProperties) => {
                    if (view === "month") {
                        const holidayContent = holidaysObject.isSuccess
                            ? holidaysObject.data
                                  .find(
                                      (holiday) =>
                                          holiday.date ===
                                          jsDateToShortISODate(d)
                                  )
                                  ?.summary?.toString()
                            : undefined
                        if (holidayContent) {
                            return (
                                <Tooltip hasArrow label={holidayContent}>
                                    <Box position={"absolute"} width={"100%"}>
                                        <Icon
                                            as={BsSunglasses}
                                            display={"block"}
                                            margin="0 auto"
                                            width={"2em"}
                                            height={"2em"}
                                            zIndex="overlay"
                                        />
                                    </Box>
                                </Tooltip>
                            )
                        }
                        const entryHours = entries
                            .filter(
                                (entry) =>
                                    entry.date === jsDateToShortISODate(d)
                            )
                            .map((item) => [
                                item.timesheet.project.name,
                                item.quantity,
                            ])
                        const joinedEntryHours = entryHours.map((item) =>
                            join(item, ": ")
                        )
                        const entryHoursForDate = sum(
                            entryHours.map((item) => item[1])
                        )
                        if (entryHoursForDate > 0) {
                            return (
                                <Tooltip
                                    hasArrow
                                    label={join(joinedEntryHours, ", ")}
                                    top={1}
                                >
                                    <span className="react-calendar__tile--tooltip">
                                        {entryHoursForDate} h
                                    </span>
                                </Tooltip>
                            )
                        }
                    }
                    return <></>
                }}
            />
        </Box>
    )
}

export default TimesheetEntryEditor

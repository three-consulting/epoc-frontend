/* eslint-disable @typescript-eslint/no-unused-vars */
import { TimesheetEntry } from "@/lib/types/apiTypes"
import _, { sum, join } from "lodash"
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Icon,
    Stack,
    StackDivider,
    Tooltip,
    Text,
    useOutsideClick,
} from "@chakra-ui/react"
import React, { useContext, useRef, useState } from "react"
import Calendar, {
    CalendarTileProperties,
    ViewCallbackProperties,
} from "react-calendar"
import { DateTime } from "luxon"
import { jsDateToShortISODate } from "@/lib/utils/date"
import useHoliday from "@/lib/hooks/useHoliday"
import { BsSunglasses } from "react-icons/bs"
import { useFlex } from "@/lib/hooks/misc"
import { MediaContext } from "@/lib/contexts/MediaContext"

const weeklyHours = (date: Date, entries: TimesheetEntry[]): number =>
    sum(
        entries
            .filter(
                (entry) =>
                    DateTime.fromISO(entry.date) <=
                        DateTime.fromJSDate(date).endOf("week") &&
                    DateTime.fromISO(entry.date) >=
                        DateTime.fromJSDate(date).startOf("week")
            )
            .map((item) => item.quantity)
    )

const monthlyHours = (date: Date, entries: TimesheetEntry[]) =>
    sum(
        entries
            .filter(
                (entry) =>
                    DateTime.fromISO(entry.date) <=
                        DateTime.fromJSDate(date).endOf("month") &&
                    DateTime.fromISO(entry.date) >=
                        DateTime.fromJSDate(date).startOf("month")
            )
            .map((item) => item.quantity)
    )

type SummaryProps = {
    hoursMonth: number
    hoursWeek: number
    flex: number
    onClose: () => void
    isOpen: boolean
}

const Summary = ({ hoursWeek, hoursMonth, flex }: SummaryProps) => (
    <Card>
        <CardHeader>
            <Heading size="md">Summary</Heading>
        </CardHeader>

        <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
                <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Hours this week
                    </Heading>
                    <Text pt="2" fontSize="sm">
                        {hoursWeek}
                    </Text>
                </Box>
                <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Hours this month
                    </Heading>
                    <Text pt="2" fontSize="sm">
                        {hoursMonth}
                    </Text>
                </Box>
                <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Flex
                    </Heading>
                    <Text pt="2" fontSize="sm">
                        {flex}
                    </Text>
                </Box>
            </Stack>
        </CardBody>
    </Card>
)

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
    const flexRequest = useFlex()

    const { isLarge } = useContext(MediaContext)

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

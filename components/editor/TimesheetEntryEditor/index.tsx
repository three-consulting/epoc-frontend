import { Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import { isDate, round, sum, join } from "lodash"
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    SimpleGrid,
    Switch,
    Tooltip,
    useOutsideClick,
} from "@chakra-ui/react"
import React, { useRef, useState, useContext } from "react"
import Calendar, {
    CalendarTileProperties,
    ViewCallbackProperties,
} from "react-calendar"
import { DateTime } from "luxon"
import { datesRange, datesValue, jsDateToShortISODate } from "@/lib/utils/date"
import useHoliday from "@/lib/hooks/useHoliday"
import { BsSunglasses } from "react-icons/bs"
import DayEditor from "./DayEditor"
import { MediaContext } from "@/lib/contexts/MediaContext"
import { useFlex } from "@/lib/hooks/misc"

interface TimesheetEntryEditorProps {
    entries: TimesheetEntry[]
    timesheets: Timesheet[]
    tasks: Task[]
}

interface WeeklyHoursProps {
    entries: TimesheetEntry[]
    dates: [Date] | [Date, Date]
}

const WeeklyHours = ({ entries, dates }: WeeklyHoursProps): JSX.Element => {
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

interface monthlyHoursProps {
    entries: TimesheetEntry[]
    dates: [Date] | [Date, Date]
}

const MonthlyHours = ({ entries, dates }: monthlyHoursProps): JSX.Element => {
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

interface FlexProps {
    flex: number
}

const TotalFlexitime = ({ flex }: FlexProps): JSX.Element => (
    <p>
        Total flex: <b>{flex}</b>
    </p>
)

const TimesheetEntryEditor = ({
    entries,
    timesheets,
    tasks,
}: TimesheetEntryEditorProps): JSX.Element => {
    const { isLarge } = useContext(MediaContext)
    const flexRequest = useFlex()

    const [selectInterval, setSelectInterval] = useState<boolean>(false)
    const [dates, setDates] = useState<[Date] | [Date | null, Date | null]>([
        null,
        null,
    ])
    const [timesheetEntries, setTimesheetEntries] =
        useState<TimesheetEntry[]>(entries)

    const holidaysObject = useHoliday()

    const onYearOrMonthChange = ({
        activeStartDate,
    }: ViewCallbackProperties) => {
        setDates([activeStartDate])
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

    const onDatesChange = (
        newDates: Date | [Date] | [Date | null, Date | null]
    ) => {
        if (Array.isArray(newDates)) {
            setDates(newDates)
        }
        if (isDate(newDates)) {
            setDates([newDates])
        }
    }

    const ref = useRef(null)

    useOutsideClick({
        ref,
        handler: () => {
            setDates([null, null])
        },
    })
    const entryDates = timesheetEntries.map(({ date: entryDate }) => entryDate)

    return (
        <>
            <>
                <Flex ref={ref} flexDirection="column">
                    <Flex
                        flexDirection="row"
                        paddingX={isLarge ? "2rem" : "0rem"}
                        paddingY={isLarge ? "1rem" : "0rem"}
                        justifyContent="center"
                        minWidth={isLarge ? "50vw" : undefined}
                    >
                        <Flex
                            flexDirection="column"
                            alignItems="center"
                            paddingY={isLarge ? "1rem" : "0rem"}
                            paddingX={isLarge ? "1rem" : "0rem"}
                            width="100%"
                            backgroundColor="#cfcfcf"
                        >
                            <Box width="100%">
                                <Calendar
                                    onChange={onDatesChange}
                                    returnValue={
                                        selectInterval ? "range" : "start"
                                    }
                                    selectRange={selectInterval}
                                    allowPartialRange={true}
                                    onActiveStartDateChange={
                                        onYearOrMonthChange
                                    }
                                    value={datesValue(dates)}
                                    tileClassName={({ date: thisDate }) => {
                                        const classNames = []
                                        const iso =
                                            jsDateToShortISODate(thisDate)
                                        if (matchDates(thisDate)) {
                                            classNames.push(
                                                "react-calendar__month-view__public_holidays"
                                            )
                                        }
                                        if (iso && entryDates.includes(iso)) {
                                            classNames.push(
                                                "react-calendar__tile--completed"
                                            )
                                        }
                                        return classNames.join(" ")
                                    }}
                                    tileContent={({
                                        date,
                                        view,
                                    }: CalendarTileProperties) => {
                                        if (view === "month") {
                                            const holidayContent =
                                                holidaysObject.isSuccess
                                                    ? holidaysObject.data
                                                          .find(
                                                              (holiday) =>
                                                                  holiday.date ===
                                                                  jsDateToShortISODate(
                                                                      date
                                                                  )
                                                          )
                                                          ?.summary?.toString()
                                                    : undefined
                                            if (holidayContent) {
                                                return (
                                                    <Tooltip
                                                        hasArrow
                                                        label={holidayContent}
                                                    >
                                                        <span>
                                                            <Icon
                                                                as={
                                                                    BsSunglasses
                                                                }
                                                                boxSize="2rem"
                                                                position="absolute"
                                                                marginY={
                                                                    isLarge
                                                                        ? "0.2rem"
                                                                        : "0.3rem"
                                                                }
                                                                marginX={
                                                                    isLarge
                                                                        ? "-0.3rem"
                                                                        : "-1.5rem"
                                                                }
                                                                zIndex="overlay"
                                                            />
                                                        </span>
                                                    </Tooltip>
                                                )
                                            }
                                            const entryHours = timesheetEntries
                                                .filter(
                                                    (entry) =>
                                                        entry.date ===
                                                        jsDateToShortISODate(
                                                            date
                                                        )
                                                )
                                                .map((item) => [
                                                    item.timesheet.project.name,
                                                    item.quantity,
                                                ])
                                            const joinedEntryHours =
                                                entryHours.map((item) =>
                                                    join(item, ": ")
                                                )
                                            const entryHoursForDate = sum(
                                                entryHours.map(
                                                    (item) => item[1]
                                                )
                                            )
                                            if (entryHoursForDate > 0) {
                                                return (
                                                    <Tooltip
                                                        hasArrow
                                                        label={join(
                                                            joinedEntryHours,
                                                            ", "
                                                        )}
                                                        top={1}
                                                    >
                                                        <span className="react-calendar__tile--tooltip">
                                                            {entryHoursForDate}{" "}
                                                            h
                                                        </span>
                                                    </Tooltip>
                                                )
                                            }
                                        }
                                        return <></>
                                    }}
                                />
                                <SimpleGrid
                                    paddingY="1rem"
                                    backgroundColor={"#efefef"}
                                    columns={1}
                                >
                                    <Flex
                                        flexDirection={
                                            isLarge ? "row" : "column"
                                        }
                                        justifyContent="space-around"
                                    >
                                        <FormControl
                                            display="flex"
                                            alignItems="center"
                                            maxWidth="15rem"
                                            marginLeft={
                                                isLarge ? "0rem" : "1rem"
                                            }
                                            marginBottom={
                                                isLarge ? "0rem" : "0.25rem"
                                            }
                                        >
                                            <FormLabel
                                                htmlFor="select-multiple-dates"
                                                mb="0"
                                                fontWeight="bold"
                                            >
                                                {"Select multiple dates: "}
                                            </FormLabel>
                                            <Switch
                                                id="select-multiple-dates"
                                                isChecked={selectInterval}
                                                onChange={() =>
                                                    setSelectInterval(
                                                        (val) => !val
                                                    )
                                                }
                                                variant="boxy"
                                                colorScheme="gray"
                                            />
                                        </FormControl>
                                        <Flex
                                            flexDirection={
                                                isLarge ? "column" : "row"
                                            }
                                            justifyContent={
                                                isLarge
                                                    ? "normal"
                                                    : "space-between"
                                            }
                                            marginTop={
                                                isLarge ? "0rem" : "0.25rem"
                                            }
                                            marginX={isLarge ? "0rem" : "1rem"}
                                        >
                                            <WeeklyHours
                                                entries={entries}
                                                dates={datesRange(dates)}
                                            />
                                            <MonthlyHours
                                                entries={entries}
                                                dates={datesRange(dates)}
                                            />
                                            {flexRequest.isSuccess && (
                                                <TotalFlexitime
                                                    flex={flexRequest.data}
                                                />
                                            )}
                                        </Flex>
                                    </Flex>
                                </SimpleGrid>
                            </Box>
                        </Flex>
                    </Flex>
                    <Box>
                        <DayEditor
                            timesheets={timesheets}
                            dateRange={datesRange(dates)}
                            entries={timesheetEntries}
                            tasks={tasks}
                            setTimesheetEntries={setTimesheetEntries}
                        />
                    </Box>
                </Flex>
            </>
        </>
    )
}

export default TimesheetEntryEditor

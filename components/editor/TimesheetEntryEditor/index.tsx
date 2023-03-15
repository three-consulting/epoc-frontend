import React, { useRef, useState } from "react"
import { Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import Calendar, {
    CalendarTileProperties,
    ViewCallbackProperties,
} from "react-calendar"
import useHoliday from "@/lib/hooks/useHoliday"
import { datesRange, datesValue, jsDateToShortISODate } from "@/lib/utils/date"
import { isDate } from "lodash"
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
import { BsSunglasses } from "react-icons/bs"
import DayEditor from "./DayEditor"
import { MonthlyHours, WeeklyHours } from "./HourComponents"

interface ITimesheetEntryEditor {
    entries: TimesheetEntry[]
    timesheets: Timesheet[]
    tasks: Task[]
}

const TimesheetEntryEditor = ({
    entries,
    timesheets,
    tasks,
}: ITimesheetEntryEditor): JSX.Element => {
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
            <Flex ref={ref} flexDirection="column">
                <Flex
                    flexDirection="row"
                    paddingX="2rem"
                    paddingY="1rem"
                    justifyContent="center"
                >
                    <Flex
                        flexDirection="column"
                        alignItems="center"
                        paddingY="1rem"
                        paddingX="1rem"
                        width="100%"
                        backgroundColor="#cfcfcf"
                    >
                        <Box>
                            <Calendar
                                onChange={onDatesChange}
                                returnValue={selectInterval ? "range" : "start"}
                                selectRange={selectInterval}
                                allowPartialRange={true}
                                onActiveStartDateChange={onYearOrMonthChange}
                                value={datesValue(dates)}
                                tileClassName={({ date: thisDate }) => {
                                    const classNames = []
                                    if (matchDates(thisDate)) {
                                        classNames.push(
                                            "react-calendar__month-view__public_holidays"
                                        )
                                    }
                                    if (
                                        entryDates.includes(
                                            jsDateToShortISODate(thisDate)
                                        )
                                    ) {
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
                                        let content = ""
                                        if (holidaysObject.isSuccess) {
                                            content =
                                                holidaysObject.data
                                                    .find(
                                                        (item) =>
                                                            item.date ===
                                                            jsDateToShortISODate(
                                                                date
                                                            )
                                                    )
                                                    ?.summary.toString() ?? ""
                                        }
                                        return (
                                            <Tooltip hasArrow label={content}>
                                                {content.length > 0 ? (
                                                    <span>
                                                        <Icon
                                                            as={BsSunglasses}
                                                            boxSize="2rem"
                                                            position="unset"
                                                            marginY="-0.6rem"
                                                            marginX="0.1rem"
                                                            zIndex="overlay"
                                                        />
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </Tooltip>
                                        )
                                    }
                                    return <></>
                                }}
                            />
                            <SimpleGrid
                                paddingY="1rem"
                                backgroundColor={"#efefef"}
                                columns={1}
                            >
                                <Flex justifyContent="space-around">
                                    <FormControl
                                        display="flex"
                                        alignItems="center"
                                        maxWidth="15rem"
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
                                                setSelectInterval((val) => !val)
                                            }
                                            variant="boxy"
                                            colorScheme="gray"
                                        />
                                    </FormControl>
                                    <Flex flexDirection="column">
                                        <WeeklyHours
                                            entries={entries}
                                            dates={datesRange(dates)}
                                        />
                                        <MonthlyHours
                                            entries={entries}
                                            dates={datesRange(dates)}
                                        />
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
    )
}

export default TimesheetEntryEditor

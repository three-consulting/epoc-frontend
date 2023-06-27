import { Holiday } from "@/lib/hooks/useHoliday"
import { TimesheetEntry } from "@/lib/types/apiTypes"
import { yyyymmddToDateTime } from "@/lib/utils/common"
import {
    Box,
    Center,
    Grid,
    GridItem,
    Heading,
    Icon,
    Tooltip,
    Text,
} from "@chakra-ui/react"
import _ from "lodash"
import { DateTime, Interval } from "luxon"
import React from "react"
import { BsSunglasses } from "react-icons/bs"

const columnW = 4.5

type DayCellProps = {
    day: DateTime
    selectedDay: DateTime
    selected: boolean
    onClick: () => void
    entries: TimesheetEntry[]
    holiday?: Holiday
}

const DayCell = ({
    day,
    selectedDay,
    selected,
    onClick,
    entries,
    holiday,
}: DayCellProps) => {
    const differentMonth = day.month !== selectedDay.month

    const bgColor = (() => {
        if (differentMonth) {
            return "white"
        } else if (entries.length > 0) {
            return "rgb(209, 255, 214)"
        }
        return "#FAFAFA"
    })()

    const selectedCss = selected ? { boxShadow: "0 0 0 4px #76E4F7" } : {}
    const red =
        day.weekday === 6 ||
        day.weekday === 7 ||
        (!_.isUndefined(holiday) && !differentMonth)
            ? { color: "red" }
            : {}

    const gray = differentMonth ? { color: "gray" } : {}
    const bold = differentMonth ? {} : { fontWeight: "600" }
    const hours = _.sum(entries.map(({ quantity }) => quantity))

    const css = {
        ...selectedCss,
        ...red,
        ...gray,
        ...bold,
        borderRadius: "3px",
    }

    return (
        <GridItem
            w={`${columnW}em`}
            h={`${columnW}em`}
            background={bgColor}
            onClick={onClick}
            __css={css}
        >
            <Box height="100%" width="100%" float="left">
                <Tooltip hasArrow label={holiday?.summary}>
                    <Box
                        position="relative"
                        top="50%"
                        transform="translateY(-50%)"
                    >
                        <Center>
                            <p>{day.day}</p>
                        </Center>
                        {!_.isUndefined(holiday) && (
                            <Center>
                                <Icon as={BsSunglasses} />
                            </Center>
                        )}
                    </Box>
                </Tooltip>
            </Box>
            {hours > 0 && (
                <Box float="right" height="100%" position="relative">
                    <Box position="absolute" bottom="0" right="0" pb={1} pr={1}>
                        <Text fontSize="xs" fontWeight="400">
                            {hours}h
                        </Text>
                    </Box>
                </Box>
            )}
        </GridItem>
    )
}

type CalendarProps = {
    entries?: TimesheetEntry[]
    selectedDate: DateTime
    setSelectedDate: React.Dispatch<React.SetStateAction<DateTime>>
    holidays: Holiday[]
}

const Calendar = ({
    entries: es,
    selectedDate,
    setSelectedDate,
    holidays,
}: CalendarProps) => {
    const entries = _.isUndefined(es) ? [] : es
    const startDate = selectedDate.startOf("month").startOf("week")
    const endDate = selectedDate.endOf("month").endOf("week")
    const days = Interval.fromDateTimes(
        startDate.startOf("day"),
        endDate.endOf("day")
    )
        .splitBy({ day: 1 })
        .map((d) => d.start)

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    return (
        <>
            <Heading size={"xl"} mb={8}>
                {selectedDate.toFormat("LLL yyyy")}
            </Heading>
            <Box height={`${7 * columnW}em`}>
                <Grid
                    templateColumns="repeat(7, 4fr)"
                    gap={2}
                    width={`${7 * columnW}em`}
                >
                    {weekdays.map((d) => (
                        <GridItem key={d}>
                            <b>{d}</b>
                        </GridItem>
                    ))}
                    {days.map(
                        (day, i) =>
                            !_.isNull(day) && (
                                <DayCell
                                    key={i}
                                    day={day}
                                    selectedDay={selectedDate}
                                    selected={day.equals(selectedDate)}
                                    onClick={() => setSelectedDate(day)}
                                    entries={entries.filter((e) =>
                                        yyyymmddToDateTime(e.date).equals(day)
                                    )}
                                    holiday={holidays.find(({ date }) =>
                                        date.equals(day)
                                    )}
                                />
                            )
                    )}
                </Grid>
            </Box>
        </>
    )
}

export default Calendar

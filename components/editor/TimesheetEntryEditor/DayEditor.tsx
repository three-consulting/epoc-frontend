import { SortingOrderIconButton } from "@/components/common/Buttons"
import Header from "@/components/common/Header"
import { CreateTimesheetEntryForm } from "@/components/form/TimesheetEntryForm"
import ImportFromCSVModal from "@/components/modal/ImportFromCSVModal"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTimesheetEntries } from "@/lib/hooks/useUpdate"
import { Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import { jsDateToShortISODate, toLocalDisplayDate } from "@/lib/utils/date"
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Select,
    Text,
    useMediaQuery,
} from "@chakra-ui/react"
import React, { Dispatch, SetStateAction, useContext, useState } from "react"
import EntryTable from "./EntryTable"

type TSetState<T> = Dispatch<SetStateAction<T>>

interface IDayEditor {
    timesheets: Timesheet[]
    dateRange: [Date] | [Date, Date]
    entries: TimesheetEntry[]
    tasks: Task[]
    setTimesheetEntries: TSetState<TimesheetEntry[]>
}

const taskByProject = (tasks: Task[], projectId: number) =>
    tasks.filter((task) => task.project.id === projectId)

const getDatesFromRange = (range: [Date] | [Date, Date]): Array<Date> => {
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

const DayEditor = ({
    timesheets,
    dateRange,
    entries,
    tasks,
    setTimesheetEntries,
}: IDayEditor): JSX.Element => {
    const [isLarge] = useMediaQuery("(min-width: 900px)")

    const { user } = useContext(UserContext)
    const { delete: del } = useUpdateTimesheetEntries(user)

    const [timesheet, setTimesheet] = useState<Timesheet | undefined>(undefined)

    const dates = getDatesFromRange(dateRange)
    const [start, end] = dateRange

    const isoStart = jsDateToShortISODate(start)
    const isoEnd = jsDateToShortISODate(end ?? null)

    const datesDisplayString = `
        ${isoStart ? toLocalDisplayDate(isoStart) : ""}
        ${isoEnd ? ` - ${toLocalDisplayDate(isoEnd)}` : ""}
    `

    const [oldestEntryFirst, setOldestEntryFirst] = useState<boolean>(false)

    const handleTimesheetChange = (
        event: React.FormEvent<HTMLSelectElement>
    ) => {
        event.preventDefault()
        const id = event.currentTarget.value
        if (id) {
            const tms = timesheets.find((_tms) => _tms.id === Number(id))
            if (tms) {
                setTimesheet(tms)
            }
        } else {
            setTimesheet(undefined)
        }
    }

    const onCancel = () => {
        setTimesheet(undefined)
    }

    const entryDates = dates.filter((dat) =>
        entries.find((ent) => ent.date === jsDateToShortISODate(dat))
    )

    return (
        <>
            <Header type="sub">{`Create a new entry on ${datesDisplayString}`}</Header>
            <Box paddingX="2rem" paddingY="1rem">
                <Box border="#6f6f6f solid 3px">
                    <Header type="element">
                        <Flex justifyContent="space-evenly" alignItems="center">
                            <FormControl display="flex" justifyContent="start">
                                <FormLabel
                                    htmlFor="select-multiple-dates"
                                    fontWeight="bold"
                                    color="whitesmoke"
                                >
                                    {"Select project: "}
                                </FormLabel>
                                <Select
                                    onChange={handleTimesheetChange}
                                    placeholder=" - "
                                    backgroundColor="whitesmoke"
                                    color="black"
                                >
                                    {timesheets.map((tms) => (
                                        <option
                                            key={`${tms.id}`}
                                            value={tms.id}
                                        >
                                            {tms.project.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            {isLarge && (
                                <>
                                    <Text
                                        style={{
                                            padding: "1rem",
                                            color: "whitesmoke",
                                        }}
                                    >
                                        {" or "}
                                    </Text>
                                    <ImportFromCSVModal
                                        setTimesheetEntries={
                                            setTimesheetEntries
                                        }
                                    />
                                </>
                            )}
                        </Flex>
                    </Header>
                    <Box paddingX="0.5rem">
                        {timesheet && timesheet.project.id && isoStart && (
                            <CreateTimesheetEntryForm
                                onCancel={onCancel}
                                timesheet={timesheet}
                                projectId={timesheet.project.id}
                                date={isoStart}
                                dates={dates}
                                key={`createEntryEditor-${timesheet.id}`}
                                tasks={taskByProject(
                                    tasks,
                                    timesheet.project.id
                                )}
                                setTimesheetEntries={setTimesheetEntries}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
            {entryDates.length > 0 && (
                <Box>
                    <Header type="sub">
                        <Flex
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            {"Previous entries: "}
                            {entryDates.length > 1 && (
                                <Flex
                                    justifyContent="right"
                                    alignItems="center"
                                    fontSize="md"
                                >
                                    <Box fontWeight="bold" color="whitesmoke">
                                        {"Sort entries: "}
                                    </Box>
                                    <SortingOrderIconButton
                                        marginX="2rem"
                                        aria-label="sortEntries"
                                        onClick={() =>
                                            setOldestEntryFirst((ent) => !ent)
                                        }
                                        oldestFirst={oldestEntryFirst}
                                    />
                                    <Box fontWeight="bold" color="whitesmoke">
                                        {`latest entries ${
                                            oldestEntryFirst ? "last" : "first"
                                        }`}
                                    </Box>
                                </Flex>
                            )}
                        </Flex>
                    </Header>

                    {(oldestEntryFirst ? dates : dates.reverse()).map(
                        (ddate, i) => {
                            const dateStr = jsDateToShortISODate(ddate)
                            const displayEntries = entries.filter(
                                (entry) => entry.date === dateStr
                            )

                            return (
                                <Box key={`timesheet-entry-${dateStr}`}>
                                    {displayEntries.length > 0 && dateStr && (
                                        <EntryTable
                                            idx={i}
                                            dateStr={dateStr}
                                            displayEntries={displayEntries}
                                            del={del}
                                            tasks={tasks}
                                            setTimesheetEntries={
                                                setTimesheetEntries
                                            }
                                        />
                                    )}
                                </Box>
                            )
                        }
                    )}
                </Box>
            )}
        </>
    )
}

export default DayEditor

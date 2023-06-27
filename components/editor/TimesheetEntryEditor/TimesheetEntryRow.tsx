import React, { Dispatch, SetStateAction, useState } from "react"
import { Task, TimesheetEntry } from "@/lib/types/apiTypes"
import { BsTrash } from "react-icons/bs"
import { DeleteHookFunction } from "@/lib/types/hooks"
import { Box, Icon, Link, Td } from "@chakra-ui/react"
import { round } from "lodash"
import { EditTimesheetEntryForm } from "@/components/form/TimesheetEntryForm"

type TSetState<T> = Dispatch<SetStateAction<T>>

interface TimesheetEntryRowProps {
    entry: TimesheetEntry
    deleteTimesheetEntry: DeleteHookFunction
    date: string
    tasks: Task[]
    setTimesheetEntries: TSetState<TimesheetEntry[]>
}

const TimesheetEntryRow = ({
    entry,
    deleteTimesheetEntry,
    date,
    tasks,
    setTimesheetEntries,
}: TimesheetEntryRowProps): JSX.Element => {
    const { id } = entry
    const projectId = entry.timesheet.project.id
    const [edit, setEdit] = useState<boolean>(false)

    return (
        <>
            {projectId && id && (
                <>
                    <Td paddingX="1.5rem">
                        {!edit && (
                            <Link
                                onClick={() => setEdit(!edit)}
                                style={{
                                    fontWeight: "bold",
                                }}
                            >
                                {round(entry.quantity, 2)} Hours on{" "}
                                {entry.timesheet.project.name}
                            </Link>
                        )}
                        {edit && (
                            <Box border="#6f6f6f solid 1px">
                                <EditTimesheetEntryForm
                                    id={id}
                                    timesheetEntry={entry}
                                    timesheet={entry.timesheet}
                                    projectId={projectId}
                                    date={date}
                                    onCancel={() => setEdit(!edit)}
                                    afterSubmit={() => setEdit(!edit)}
                                    tasks={tasks}
                                    setTimesheetEntries={setTimesheetEntries}
                                />
                            </Box>
                        )}
                    </Td>
                    <Td display="flex" justifyContent="end">
                        <Link
                            onClick={() => {
                                setTimesheetEntries((entries) => {
                                    const indx = entries.findIndex(
                                        (ent) => ent.id === id
                                    )
                                    if (indx !== -1) {
                                        entries.splice(indx, 1)
                                    }
                                    return entries
                                })
                                deleteTimesheetEntry([id], () => undefined)
                            }}
                        >
                            <Icon as={BsTrash} boxSize="1.5rem" />
                        </Link>
                    </Td>
                </>
            )}
        </>
    )
}

export default TimesheetEntryRow

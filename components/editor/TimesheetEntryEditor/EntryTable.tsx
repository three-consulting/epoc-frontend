import { TableHeader } from "@/components/common/Header"
import { Task, TimesheetEntry } from "@/lib/types/apiTypes"
import { DeleteHookFunction } from "@/lib/types/hooks"
import { toLocalDisplayDate } from "@/lib/utils/date"
import { Icon, Table, TableContainer, Tbody, Tr } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { BsCaretDown, BsCaretLeft } from "react-icons/bs"
import TimesheetEntryRow from "./TimesheetEntryRow"
import { taskByProject, TSetState } from "./utils"

interface IEntryTable {
    dateStr: string
    displayEntries: Array<TimesheetEntry>
    del: DeleteHookFunction
    tasks: Array<Task>
    setTimesheetEntries: TSetState<Array<TimesheetEntry>>
    idx: number
}

const EntryTable = ({
    dateStr,
    displayEntries,
    del,
    tasks,
    setTimesheetEntries,
    idx,
}: IEntryTable) => {
    const [open, setOpen] = useState<boolean>(false)
    const header = ` - ${displayEntries
        .map((ent) => ent.quantity ?? 0)
        .join(" + ")} hours`

    useEffect(() => {
        if (idx === 0) {
            setOpen(() => true)
        } else {
            setOpen(() => false)
        }
    }, [idx])

    return (
        <TableContainer
            marginY="1rem"
            marginX="2rem"
            border="#6f6f6f solid 3px"
        >
            <TableHeader
                text={toLocalDisplayDate(dateStr) + (open ? "" : header)}
                icon={
                    <Icon
                        as={open ? BsCaretDown : BsCaretLeft}
                        boxSize="1.5rem"
                    />
                }
                onClick={() => setOpen((opn) => !opn)}
            />
            <Table variant="simple">
                {open && (
                    <Tbody>
                        {displayEntries.map(
                            (entry) =>
                                entry.timesheet.project.id && (
                                    <Tr key={`${entry.id}`}>
                                        <TimesheetEntryRow
                                            entry={entry}
                                            deleteTimesheetEntry={del}
                                            date={dateStr}
                                            tasks={taskByProject(
                                                tasks,
                                                entry.timesheet.project.id
                                            )}
                                            setTimesheetEntries={
                                                setTimesheetEntries
                                            }
                                        />
                                    </Tr>
                                )
                        )}
                    </Tbody>
                )}
            </Table>
        </TableContainer>
    )
}

export default EntryTable

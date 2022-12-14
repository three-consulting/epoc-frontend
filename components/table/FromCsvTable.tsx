import React from "react"
import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react"
import {
    TKeyOfRecord,
    TKeyOfRecordState,
    TRecord,
} from "../modal/ImportFromCSVModal"
import { Task, Timesheet } from "@/lib/types/apiTypes"

interface IFromCsvTable {
    records: Array<TRecord>
    recordKeys: Array<TKeyOfRecord>
    projectKey: TKeyOfRecordState
    taskKey: TKeyOfRecordState
    timesheetsUsed: Array<Timesheet | null>
    tasksUsed: Array<Task | null>
    errorHandler: (err: Error) => void
}
const FromCsvTable = ({
    records,
    recordKeys,
    projectKey,
    taskKey,
    timesheetsUsed,
    tasksUsed,
}: IFromCsvTable): JSX.Element => (
    <TableContainer height="40rem" overflowY="scroll">
        <Table variant="simple" size="sm">
            <Thead>
                <Tr>
                    <Th>{"Date"}</Th>
                    <Th>{"Quantity"}</Th>
                    <Th>{"Project"}</Th>
                    <Th>{"Task"}</Th>
                    <Th>{"Description"}</Th>
                </Tr>
            </Thead>
            <Tbody>
                {records.map((rec, i) => (
                    <Tr key={JSON.stringify(rec)}>
                        {recordKeys.length > 0 &&
                            recordKeys.map((key) => {
                                if (key === projectKey) {
                                    return (
                                        <Td
                                            key={key}
                                            style={{
                                                maxWidth: "11rem",
                                                overflowX: "hidden",
                                            }}
                                        >
                                            {timesheetsUsed[i]?.project.name ||
                                                " - "}
                                        </Td>
                                    )
                                }

                                if (key === taskKey) {
                                    return (
                                        <Td
                                            key={key}
                                            style={{
                                                maxWidth: "11rem",
                                                overflowX: "hidden",
                                            }}
                                        >
                                            {tasksUsed[i]?.name || " - "}
                                        </Td>
                                    )
                                }
                                return (
                                    <Td
                                        key={key}
                                        style={{
                                            maxWidth: "11rem",
                                            overflowX: "hidden",
                                        }}
                                    >
                                        {key ? rec[key] : ""}
                                    </Td>
                                )
                            })}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    </TableContainer>
)

export default FromCsvTable

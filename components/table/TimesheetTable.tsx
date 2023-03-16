import { Box } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React from "react"
import { Timesheet } from "@/lib/types/apiTypes"
import { useRouter } from "next/router"
import FormSection from "../common/FormSection"
import FormButtons from "../common/FormButtons"
import { StyledButton } from "../common/Buttons"
import Link from "next/link"

interface ITimesheetRow {
    timesheet: Timesheet
}
const TimesheetRow = ({ timesheet }: ITimesheetRow): JSX.Element => (
    <Link href={`timesheet/${timesheet.id}`}>
        <Tr
            _hover={{
                backgroundColor: "#6f6f6f",
                color: "whitesmoke",
                cursor: "pointer",
            }}
        >
            <Td>
                {`${timesheet.employee?.firstName} ${timesheet.employee?.lastName}`}
            </Td>
            <Td>{`${timesheet.allocation} %`}</Td>
        </Tr>
    </Link>
)

interface ITimesheetTable {
    timesheets: Timesheet[]
}

const TimesheetTable = ({ timesheets }: ITimesheetTable): JSX.Element => {
    const router = useRouter()

    return (
        <FormSection header="Timesheets">
            <>
                {timesheets.filter(
                    (timesheet) => timesheet.status !== "ARCHIVED"
                ).length ? (
                    <Box borderWidth="1px" padding="1rem" marginBottom="1rem">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Allocation</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {timesheets.map(
                                    (timesheet, idx) =>
                                        timesheet.status !== "ARCHIVED" && (
                                            <TimesheetRow
                                                timesheet={timesheet}
                                                key={idx}
                                            />
                                        )
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                ) : (
                    <Box borderWidth="1px" padding="1rem" marginBottom="1rem">
                        No users in this project.
                        <br />
                        To add a user click the button below.
                    </Box>
                )}
                <FormButtons>
                    <StyledButton
                        buttontype="add"
                        onClick={() => router.push("/timesheet/new")}
                    />
                </FormButtons>
            </>
        </FormSection>
    )
}

export default TimesheetTable

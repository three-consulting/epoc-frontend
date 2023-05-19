import { Box } from "@chakra-ui/layout"
import {
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React, { useContext, useState } from "react"
import ErrorAlert from "../common/ErrorAlert"
import { Employee, Project, Timesheet } from "@/lib/types/apiTypes"
import { CreateTimesheetForm } from "../form/TimesheetForm"
import { useRouter } from "next/router"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTimesheets } from "@/lib/hooks/useUpdate"
import FormSection from "../common/FormSection"
import StyledButtons from "../common/StyledButtons"
import { RemoveIconButton, StyledButton } from "../common/Buttons"

interface TimesheetRowProps {
    timesheet: Timesheet
}
function TimesheetRow({ timesheet }: TimesheetRowProps): JSX.Element {
    const router = useRouter()
    const { user } = useContext(UserContext)
    const { put } = useUpdateTimesheets(user)

    const [errorMessage, setErrorMessage] = useState<string>()
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const archiveTimesheet = async (
        timesheetToArchive: Timesheet,
        event: React.MouseEvent
    ) => {
        event.preventDefault()
        await put({ ...timesheetToArchive, status: "ARCHIVED" }, errorHandler)
    }

    const pushToTimesheet = (
        timesheetId: number | undefined,
        event: React.MouseEvent
    ) => {
        event.preventDefault()
        if (timesheetId) {
            router.push(`/timesheet/${timesheetId}`)
        }
    }

    return (
        <>
            <Tr
                _hover={{
                    backgroundColor: "#6f6f6f",
                    color: "whitesmoke",
                    cursor: "pointer",
                }}
            >
                <Td onClick={(event) => pushToTimesheet(timesheet.id, event)}>
                    {timesheet.employee?.firstName}{" "}
                    {timesheet.employee?.lastName}
                </Td>
                <Td onClick={(event) => pushToTimesheet(timesheet.id, event)}>
                    {timesheet.allocation} %
                </Td>
                <Td display="flex" justifyContent="end">
                    <RemoveIconButton
                        aria-label="Remove"
                        onClick={(event) => archiveTimesheet(timesheet, event)}
                    />
                </Td>
            </Tr>
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}

interface TimesheetTableProps {
    project: Project
    timesheets: Timesheet[]
    employees: Employee[]
}

function TimesheetTable({
    project,
    timesheets,
    employees,
}: TimesheetTableProps): JSX.Element {
    const [displayNewTimesheetForm, setDisplayNewTimesheetForm] =
        useState(false)

    return (
        <FormSection header="Users">
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
                                    <Th />
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
                <StyledButtons>
                    <StyledButton
                        buttontype="add"
                        name="User"
                        onClick={() => setDisplayNewTimesheetForm(true)}
                    />
                </StyledButtons>
                {project.id && (
                    <Modal
                        isOpen={displayNewTimesheetForm}
                        onClose={() => setDisplayNewTimesheetForm(false)}
                    >
                        <ModalOverlay />
                        <ModalContent
                            paddingX="1rem"
                            paddingBottom="1rem"
                            backgroundColor="whitesmoke"
                        >
                            <ModalHeader>Add user to project</ModalHeader>
                            <CreateTimesheetForm
                                project={project}
                                projectId={project.id}
                                employees={employees}
                                afterSubmit={(timesheetUpdate) =>
                                    timesheetUpdate.isSuccess &&
                                    setDisplayNewTimesheetForm(false)
                                }
                                onCancel={() =>
                                    setDisplayNewTimesheetForm(false)
                                }
                            />
                            <ModalCloseButton />
                        </ModalContent>
                    </Modal>
                )}
            </>
        </FormSection>
    )
}

export default TimesheetTable

import { Box } from "@chakra-ui/layout"
import {
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React, { useState } from "react"
import { Employee, Project, Timesheet } from "@/lib/types/apiTypes"
import { CreateTimesheetForm } from "../form/TimesheetForm"
import { useRouter } from "next/router"
import FormSection from "../common/FormSection"
import FormButtons from "../common/FormButtons"
import { StyledButton } from "../common/Buttons"

interface TimesheetRowProps {
    timesheet: Timesheet
}
function TimesheetRow({ timesheet }: TimesheetRowProps): JSX.Element {
    const router = useRouter()

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
        <Tr
            _hover={{
                backgroundColor: "#6f6f6f",
                color: "whitesmoke",
                cursor: "pointer",
            }}
        >
            <Td onClick={(event) => pushToTimesheet(timesheet.id, event)}>
                {timesheet.employee?.firstName} {timesheet.employee?.lastName}
            </Td>
            <Td onClick={(event) => pushToTimesheet(timesheet.id, event)}>
                {timesheet.allocation} %
            </Td>
        </Tr>
    )
}

interface TimesheetTableProps {
    timesheets: Timesheet[]
    project?: Project
    employees?: Employee[]
}

const TimesheetTable = ({
    project,
    timesheets,
    employees,
}: TimesheetTableProps): JSX.Element => {
    const [displayNewTimesheetForm, setDisplayNewTimesheetForm] =
        useState(false)

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
                        onClick={() => setDisplayNewTimesheetForm(true)}
                    />
                </FormButtons>
                {project?.id && employees && (
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

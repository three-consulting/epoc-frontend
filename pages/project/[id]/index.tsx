import React, { useContext, useState } from "react"
import { Box } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import {
    Center,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
} from "@chakra-ui/react"
import Link from "next/link"
import TimesheetTable from "@/components/table/TimesheetTable"
import TaskTable from "@/components/table/TaskTable"
import ProjectDetail from "@/components/detail/ProjectDetail"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useProjectDetail } from "@/lib/hooks/useDetail"
import { useTimesheets, useEmployees, useTasks } from "@/lib/hooks/useList"
import { useUpdateProjects } from "@/lib/hooks/useUpdate"
import FormSection from "@/components/common/FormSection"
import FormPage from "@/components/common/FormPage"
import FormButtons from "@/components/common/FormButtons"
import {
    CustomButton,
    StyledButton,
    RemoveIconButton,
} from "@/components/common/Buttons"

type Props = {
    projectId: number
}

type ProjectStatus = "ACTIVE" | "ARCHIVED"

function ProjectDetailPage({ projectId }: Props): JSX.Element {
    const { user } = useContext(UserContext)
    const projectDetailResponse = useProjectDetail(projectId, user)
    const timesheetsResponse = useTimesheets(user, projectId)
    const employeesResponse = useEmployees(user)
    const tasksResponse = useTasks(user, projectId)

    const { put } = useUpdateProjects(user)

    const [displayArchivedModal, setDisplayArchivedModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const changeProjectStatus = async (
        mouseEvent: React.MouseEvent,
        status: ProjectStatus
    ) => {
        mouseEvent.preventDefault()
        if (projectDetailResponse.isSuccess) {
            await put({ ...projectDetailResponse.data, status }, (error) =>
                setErrorMessage(`${error}`)
            )
            setDisplayArchivedModal(true)
        } else {
            setErrorMessage("Project failed to load.")
        }
    }

    const onArchive = (event: React.MouseEvent) =>
        changeProjectStatus(event, "ARCHIVED")
    const onActivate = (event: React.MouseEvent) =>
        changeProjectStatus(event, "ACTIVE")
    const onClose = () => setDisplayArchivedModal(false)

    const getName = () =>
        projectDetailResponse.isSuccess ? projectDetailResponse.data.name : ""
    const getStatus = () =>
        projectDetailResponse.isSuccess ? projectDetailResponse.data.status : ""
    const getStatusString = () => {
        switch (getStatus()) {
            case "ACTIVE": {
                return "reactivated"
            }
            case "ARCHIVED": {
                return "archived"
            }
            default: {
                return ""
            }
        }
    }
    const getCustomButtonProps = () => {
        switch (getStatus()) {
            case "ACTIVE": {
                return {
                    text: "Archive Project",
                    colorScheme: "pink",
                    variant: "outline",
                    onClick: onArchive,
                }
            }
            case "ARCHIVED": {
                return {
                    text: "Rectivate Project",
                    colorScheme: "teal",
                    onClick: onActivate,
                }
            }
            default: {
                return {}
            }
        }
    }

    return (
        <FormPage
            header={
                projectDetailResponse.isSuccess
                    ? projectDetailResponse.data.name ?? "-"
                    : "-"
            }
        >
            <Box>
                {errorMessage ? (
                    <>
                        <ErrorAlert />
                        <Box>{errorMessage}</Box>
                    </>
                ) : null}
                {projectDetailResponse.isLoading && <Loading />}
                {projectDetailResponse.isError && (
                    <ErrorAlert
                        title={projectDetailResponse.errorMessage}
                        message={projectDetailResponse.errorMessage}
                    />
                )}
                {projectDetailResponse.isSuccess ? (
                    <>
                        <FormSection header="Project details">
                            <ProjectDetail
                                project={projectDetailResponse.data}
                            />
                            <FormButtons>
                                <Link
                                    key={`${projectId}`}
                                    href={`${projectId}/edit`}
                                >
                                    <StyledButton buttontype="edit" />
                                </Link>
                                <CustomButton {...getCustomButtonProps()} />
                            </FormButtons>
                        </FormSection>

                        <Modal
                            isOpen={displayArchivedModal}
                            onClose={() => setDisplayArchivedModal(false)}
                        >
                            <ModalOverlay />
                            <ModalContent borderRadius="0">
                                <ModalBody paddingY="1rem" paddingX="1rem">
                                    <Flex justifyContent="end">
                                        <RemoveIconButton
                                            aria-label="Close"
                                            onClick={onClose}
                                        />
                                    </Flex>
                                    <Center paddingY="2rem">
                                        {`${getName()} has been ${getStatusString()}.`}
                                    </Center>
                                </ModalBody>
                            </ModalContent>
                        </Modal>

                        {timesheetsResponse.isLoading && <Loading />}
                        {timesheetsResponse.isError && (
                            <ErrorAlert
                                title={timesheetsResponse.errorMessage}
                                message={timesheetsResponse.errorMessage}
                            />
                        )}
                        {projectDetailResponse.data.status === "ACTIVE" && (
                            <>
                                {timesheetsResponse.isSuccess &&
                                    employeesResponse.isSuccess && (
                                        <TimesheetTable
                                            project={projectDetailResponse.data}
                                            timesheets={timesheetsResponse.data}
                                            employees={employeesResponse.data}
                                        />
                                    )}
                                {tasksResponse.isSuccess && (
                                    <TaskTable
                                        project={projectDetailResponse.data}
                                        tasks={tasksResponse.data}
                                    />
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <Box>Not found</Box>
                )}
            </Box>
        </FormPage>
    )
}

const Page: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <ProjectDetailPage projectId={Number(id)} /> : null
}

export default Page

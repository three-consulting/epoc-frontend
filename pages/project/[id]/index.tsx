import React, { useContext, useState } from "react"
import { Box, Flex } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
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

    return (
        <div>
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
                    <Flex flexDirection="column">
                        <ProjectDetail project={projectDetailResponse.data} />
                    </Flex>
                    <Link key={`${projectId}`} href={`${projectId}/edit`}>
                        <Button colorScheme="blue" marginTop="1rem">
                            Edit Project
                        </Button>
                    </Link>
                    {projectDetailResponse.data.status === "ACTIVE" ? (
                        <Button
                            colorScheme="pink"
                            marginTop="1rem"
                            marginLeft="0.5rem"
                            onClick={(event: React.MouseEvent) =>
                                changeProjectStatus(event, "ARCHIVED")
                            }
                        >
                            Archive Project
                        </Button>
                    ) : (
                        <Button
                            colorScheme="teal"
                            marginTop="1rem"
                            marginLeft="0.5rem"
                            onClick={(event: React.MouseEvent) =>
                                changeProjectStatus(event, "ACTIVE")
                            }
                        >
                            Rectivate Project
                        </Button>
                    )}
                    <Modal
                        isOpen={displayArchivedModal}
                        onClose={() => setDisplayArchivedModal(false)}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalBody marginTop="1rem">
                                {`${projectDetailResponse.data.name} has been 
                                ${
                                    projectDetailResponse.data.status ===
                                    "ARCHIVED"
                                        ? "archived"
                                        : "reactivated"
                                }.`}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    colorScheme="blue"
                                    onClick={() =>
                                        setDisplayArchivedModal(false)
                                    }
                                >
                                    Close
                                </Button>
                            </ModalFooter>
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
        </div>
    )
}

const Page: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <ProjectDetailPage projectId={Number(id)} /> : null
}

export default Page

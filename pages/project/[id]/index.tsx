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
import TimesheetTable from "@/components/table/TimesheetTable"
import TaskTable from "@/components/table/TaskTable"
import ProjectDetail from "@/components/detail/ProjectDetail"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useProjectDetail } from "@/lib/hooks/useDetail"
import { useTimesheets, useTasks } from "@/lib/hooks/useList"
import { useUpdateProjects } from "@/lib/hooks/useUpdate"
import FormSection from "@/components/common/FormSection"
import FormPage from "@/components/common/FormPage"
import FormButtons from "@/components/common/FormButtons"
import {
    CustomButton,
    StyledButton,
    RemoveIconButton,
} from "@/components/common/Buttons"

interface IProjectDetailPage {
    projectId: number
}

type ProjectStatus = "ACTIVE" | "ARCHIVED"

const ProjectDetailPage = ({ projectId }: IProjectDetailPage): JSX.Element => {
    const { user } = useContext(UserContext)

    const router = useRouter()

    const projectDetailResponse = useProjectDetail(projectId, user)
    const timesheetsResponse = useTimesheets(user, projectId)
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
                    text: "Archive",
                    colorScheme: "pink",
                    variant: "outline",
                    onClick: onArchive,
                }
            }
            case "ARCHIVED": {
                return {
                    text: "Rectivate",
                    colorScheme: "teal",
                    onClick: onActivate,
                }
            }
            default: {
                return {}
            }
        }
    }

    const onEditClick = (url: string) => router.push(url)

    return (
        <FormPage header="Projects">
            <Box>
                {projectDetailResponse.isLoading && <Loading />}
                {errorMessage && (
                    <ErrorAlert title={errorMessage} message={errorMessage} />
                )}
                {projectDetailResponse.isSuccess ? (
                    <>
                        <FormSection
                            header={projectDetailResponse.data.name ?? "-"}
                        >
                            <ProjectDetail
                                project={projectDetailResponse.data}
                            />
                            <FormButtons>
                                <StyledButton
                                    buttontype="edit"
                                    onClick={() =>
                                        onEditClick(`${projectId}/edit`)
                                    }
                                />
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

                        {projectDetailResponse.data.status === "ACTIVE" && (
                            <>
                                {timesheetsResponse.isSuccess && (
                                    <TimesheetTable
                                        timesheets={timesheetsResponse.data}
                                    />
                                )}
                                {tasksResponse.isSuccess && (
                                    <TaskTable tasks={tasksResponse.data} />
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

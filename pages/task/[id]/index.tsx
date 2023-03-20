import React, { useContext, useState } from "react"
import { Box } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useTaskDetail } from "@/lib/hooks/useDetail"
import {
    CustomButton,
    RemoveIconButton,
    StyledButton,
} from "@/components/common/Buttons"
import FormButtons from "@/components/common/FormButtons"
import FormSection from "@/components/common/FormSection"
import FormPage from "@/components/common/FormPage"
import TaskDetail from "@/components/detail/TaskDetail"
import { useUpdateTasks } from "@/lib/hooks/useUpdate"
import {
    Center,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
} from "@chakra-ui/react"

interface ITaskDetailPage {
    taskId: number
}

type TaskStatus = "ACTIVE" | "ARCHIVED"

const TaskDetailPage = ({ taskId }: ITaskDetailPage): JSX.Element => {
    const { user } = useContext(UserContext)

    const router = useRouter()

    const taskDetailResponse = useTaskDetail(taskId, user)

    const { put } = useUpdateTasks(user)

    const [displayArchivedModal, setDisplayArchivedModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const getHeader = () =>
        taskDetailResponse.isSuccess ? taskDetailResponse.data.name : " - "
    const changeTaskStatus = async (
        mouseEvent: React.MouseEvent,
        status: TaskStatus
    ) => {
        mouseEvent.preventDefault()
        if (taskDetailResponse.isSuccess) {
            await put({ ...taskDetailResponse.data, status }, (error) =>
                setErrorMessage(`${error}`)
            )
            setDisplayArchivedModal(true)
        } else {
            setErrorMessage("Task failed to load.")
        }
    }

    const onArchive = (event: React.MouseEvent) =>
        changeTaskStatus(event, "ARCHIVED")
    const onActivate = (event: React.MouseEvent) =>
        changeTaskStatus(event, "ACTIVE")
    const onClose = () => setDisplayArchivedModal(false)

    const getName = () =>
        taskDetailResponse.isSuccess ? taskDetailResponse.data.name : ""
    const getStatus = () =>
        taskDetailResponse.isSuccess ? taskDetailResponse.data.status : ""
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
        <FormPage header="Tasks">
            <Box>
                {taskDetailResponse.isLoading && <Loading />}
                {errorMessage && (
                    <ErrorAlert title={errorMessage} message={errorMessage} />
                )}
                {taskDetailResponse.isSuccess ? (
                    <>
                        <FormSection header={getHeader()}>
                            <TaskDetail task={taskDetailResponse.data} />
                            <FormButtons>
                                <StyledButton
                                    buttontype="edit"
                                    onClick={() =>
                                        onEditClick(
                                            `${taskDetailResponse.data.id}/edit`
                                        )
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
    return id ? <TaskDetailPage taskId={Number(id)} /> : null
}

export default Page

import React, { useContext } from "react"
import { Box } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useTaskDetail } from "@/lib/hooks/useDetail"
import { StyledButton } from "@/components/common/Buttons"
import FormButtons from "@/components/common/FormButtons"
import FormSection from "@/components/common/FormSection"
import FormPage from "@/components/common/FormPage"
import TaskDetail from "@/components/detail/TaskDetail"

interface ITaskDetailPage {
    taskId: number
}

const TaskDetailPage = ({ taskId }: ITaskDetailPage): JSX.Element => {
    const { user } = useContext(UserContext)

    const router = useRouter()

    const taskDetailResponse = useTaskDetail(taskId, user)

    const getHeader = () =>
        taskDetailResponse.isSuccess ? taskDetailResponse.data.name : " - "

    const onEditClick = (url: string) => router.push(url)

    return (
        <FormPage header="Tasks">
            {taskDetailResponse.isLoading && <Loading />}
            {taskDetailResponse.isError && (
                <ErrorAlert
                    title={taskDetailResponse.errorMessage}
                    message={taskDetailResponse.errorMessage}
                />
            )}
            {taskDetailResponse.isSuccess ? (
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
                    </FormButtons>
                </FormSection>
            ) : (
                <Box>Not found</Box>
            )}
        </FormPage>
    )
}

const Page: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <TaskDetailPage taskId={Number(id)} /> : null
}

export default Page

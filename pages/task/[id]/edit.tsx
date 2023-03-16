import React, { useContext } from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/dist/client/router"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useTaskDetail } from "@/lib/hooks/useDetail"
import { useEmployees } from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"
import { Box } from "@chakra-ui/react"
import { EditTaskForm } from "@/components/form/TaskForm"

interface IEditTaskPage {
    taskId: number
}

const EditTaskPage = ({ taskId }: IEditTaskPage): JSX.Element => {
    const router = useRouter()
    const { user } = useContext(UserContext)

    const taskDetailResponse = useTaskDetail(taskId, user)
    const employeesResponse = useEmployees(user)

    const errorMessage =
        (taskDetailResponse.isError && taskDetailResponse.errorMessage) ||
        (employeesResponse.isError && employeesResponse.errorMessage) ||
        ""

    const redirectToTaskDetail = () => router.push(`/task/${taskId}`)

    return (
        <FormPage header="Tasks">
            <Box>
                {(taskDetailResponse.isLoading ||
                    employeesResponse.isLoading) && <Loading />}
                {(taskDetailResponse.isError || employeesResponse.isError) && (
                    <ErrorAlert title={errorMessage} message={errorMessage} />
                )}
                {taskDetailResponse.isSuccess &&
                    employeesResponse.isSuccess &&
                    taskDetailResponse.data.id &&
                    taskDetailResponse.data.project.id && (
                        <EditTaskForm
                            task={taskDetailResponse.data}
                            project={taskDetailResponse.data.project}
                            afterSubmit={redirectToTaskDetail}
                            onCancel={redirectToTaskDetail}
                        />
                    )}
            </Box>
        </FormPage>
    )
}

const Edit: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <EditTaskPage taskId={Number(id)} /> : null
}

export default Edit

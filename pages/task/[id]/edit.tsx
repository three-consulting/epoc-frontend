import React from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import Layout from "@/components/common/Layout"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/dist/client/router"
import { useTaskDetail } from "@/lib/hooks/useTasks"
import { EditTaskForm } from "@/components/form/TaskForm"

type Props = {
    taskId: number
}

function EditTaskPage({ taskId }: Props): JSX.Element {
    const router = useRouter()

    const taskDetailResponse = useTaskDetail(taskId)

    const errorMessage =
        (taskDetailResponse.isError && taskDetailResponse.errorMessage) || ""

    const redirectToTaskDetail = () => router.push(`/task/${taskId}`)

    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                Edit task
            </Heading>
            {taskDetailResponse.isLoading && <Loading />}
            {taskDetailResponse.isError && (
                <ErrorAlert title={errorMessage} message={errorMessage} />
            )}
            {taskDetailResponse.isSuccess &&
                taskDetailResponse.data.id &&
                taskDetailResponse.data.project.id && (
                    <EditTaskForm
                        task={taskDetailResponse.data}
                        taskId={taskDetailResponse.data.id}
                        project={taskDetailResponse.data.project}
                        projectId={taskDetailResponse.data.project.id}
                        afterSubmit={redirectToTaskDetail}
                        onCancel={redirectToTaskDetail}
                    />
                )}
        </Layout>
    )
}

const Edit: NextPage = () => {
    const router = useRouter()
    const id = router.query.id as string | undefined
    return id ? <EditTaskPage taskId={Number(id)} /> : null
}

export default Edit

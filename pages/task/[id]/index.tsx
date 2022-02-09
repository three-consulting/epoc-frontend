import React from "react"
import { Box } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import Layout from "@/components/common/Layout"
import { useTaskDetail } from "@/lib/hooks/useTasks"
import TaskDetail from "@/components/detail/TaskDetail"
import Link from "next/link"
import { Button } from "@chakra-ui/react"

type Props = {
    taskId: number
}

function TaskDetailPage({ taskId }: Props): JSX.Element {
    const taskDetailResponse = useTaskDetail(taskId)

    return (
        <Layout>
            {taskDetailResponse.isLoading && <Loading />}
            {taskDetailResponse.isError && (
                <ErrorAlert
                    title={taskDetailResponse.errorMessage}
                    message={taskDetailResponse.errorMessage}
                />
            )}
            {taskDetailResponse.isSuccess ? (
                <>
                    <TaskDetail task={taskDetailResponse.data} />
                    <Link
                        key={`${taskDetailResponse.data.id}`}
                        href={`${taskDetailResponse.data.id}/edit`}
                    >
                        <Button colorScheme="blue" marginTop="1rem">
                            Edit Task
                        </Button>
                    </Link>
                </>
            ) : (
                <Box>Not found</Box>
            )}
        </Layout>
    )
}

const Page: NextPage = () => {
    const router = useRouter()
    const id = router.query.id as string | undefined
    return id ? <TaskDetailPage taskId={Number(id)} /> : null
}

export default Page

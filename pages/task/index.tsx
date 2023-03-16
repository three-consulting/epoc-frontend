import React, { useContext } from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useTasks } from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"
import TaskTable from "@/components/table/TaskTable"

const Tasks: NextPage = () => {
    const { user } = useContext(UserContext)
    const tasksResponse = useTasks(user)

    return (
        <FormPage header="Tasks">
            {tasksResponse.isLoading && <Loading />}
            {tasksResponse.isError && (
                <ErrorAlert
                    title={tasksResponse.errorMessage}
                    message={tasksResponse.errorMessage}
                />
            )}
            {tasksResponse.isSuccess && (
                <TaskTable tasks={tasksResponse.data} />
            )}
        </FormPage>
    )
}

export default Tasks

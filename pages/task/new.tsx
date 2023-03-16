import React, { useContext } from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/router"
import { Task } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useCustomers, useEmployees } from "@/lib/hooks/useList"
import { Box } from "@chakra-ui/react"
import FormPage from "@/components/common/FormPage"
import { CreateTaskForm } from "@/components/form/TaskForm"

const New: NextPage = () => {
    const router = useRouter()
    const { user } = useContext(UserContext)
    const customersResponse = useCustomers(user)
    const employeesResponse = useEmployees(user)

    const errorMessage =
        (customersResponse.isError && customersResponse.errorMessage) ||
        (employeesResponse.isError && employeesResponse.errorMessage) ||
        ""

    const redirectToTaskList = () => router.push("/task")
    const redirectToTaskDetails = (
        createTaskResponse: ApiUpdateResponse<Task>
    ) =>
        createTaskResponse.isSuccess &&
        createTaskResponse.data.id &&
        router.push(`/task/${createTaskResponse.data.id}`)

    return (
        <FormPage header="Tasks">
            <Box>
                {(customersResponse.isLoading ||
                    employeesResponse.isLoading) && <Loading />}
                {(customersResponse.isError || employeesResponse.isError) && (
                    <ErrorAlert title={errorMessage} message={errorMessage} />
                )}
                {customersResponse.isSuccess && employeesResponse.isSuccess && (
                    <CreateTaskForm
                        afterSubmit={redirectToTaskDetails}
                        onCancel={redirectToTaskList}
                    />
                )}
            </Box>
        </FormPage>
    )
}

export default New

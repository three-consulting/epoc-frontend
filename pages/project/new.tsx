import React from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { CreateProjectForm } from "@/components/form/ProjectForm"
import { useRouter } from "next/router"
import { Project } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { useCustomers, useEmployees } from "@/lib/hooks/useList"
import { Box } from "@chakra-ui/react"
import FormPage from "@/components/common/FormPage"

const New: NextPage = () => {
    const router = useRouter()
    const customersResponse = useCustomers()
    const employeesResponse = useEmployees()

    const errorMessage =
        (customersResponse.isError && customersResponse.errorMessage) ||
        (employeesResponse.isError && employeesResponse.errorMessage) ||
        ""

    const redirectToProjectList = () => router.push("/project")
    const redirectToProjectDetails = (
        createProjectResponse: ApiUpdateResponse<Project>
    ) =>
        createProjectResponse.isSuccess &&
        createProjectResponse.data.id &&
        router.push(`/project/${createProjectResponse.data.id}`)

    return (
        <FormPage header="New project">
            <Box>
                {(customersResponse.isLoading ||
                    employeesResponse.isLoading) && <Loading />}
                {(customersResponse.isError || employeesResponse.isError) && (
                    <ErrorAlert title={errorMessage} message={errorMessage} />
                )}
                {customersResponse.isSuccess && employeesResponse.isSuccess && (
                    <CreateProjectForm
                        customers={customersResponse.data}
                        employees={employeesResponse.data}
                        afterSubmit={redirectToProjectDetails}
                        onCancel={redirectToProjectList}
                    />
                )}
            </Box>
        </FormPage>
    )
}

export default New

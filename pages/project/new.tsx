import React from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import Layout from "@/components/common/Layout"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useCustomers } from "@/lib/hooks/useCustomers"
import { useEmployees } from "@/lib/hooks/useEmployees"
import { CreateProjectForm } from "@/components/form/ProjectForm"
import { useRouter } from "next/router"
import { Project } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"

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
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                New project
            </Heading>
            {(customersResponse.isLoading || employeesResponse.isLoading) && (
                <Loading />
            )}
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
        </Layout>
    )
}

export default New

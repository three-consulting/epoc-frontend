import React, { useContext } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useCustomers } from "@/lib/hooks/useCustomers"
import { useEmployees } from "@/lib/hooks/useEmployees"
import { CreateProjectForm } from "@/components/form/ProjectForm"
import { useRouter } from "next/router"
import { Project } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"

const New: NextPage = () => {
    const router = useRouter()
    const { user } = useContext(UserContext)
    const customersResponse = useCustomers(user)
    const employeesResponse = useEmployees(user)

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
        <div>
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
        </div>
    )
}

export default New

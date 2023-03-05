import React from "react"
import type { NextPage } from "next"
import { EditProjectForm } from "@/components/form/ProjectForm"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/dist/client/router"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useProjectDetail } from "@/lib/hooks/useDetail"
import { useCustomers, useEmployees } from "@/lib/hooks/useList"
import { Box } from "@chakra-ui/react"
import FormPage from "@/components/common/FormPage"
import { User } from "firebase/auth"

interface IEditProjectPage {
    projectId: number
    user: User
}

const EditProjectPage = ({
    projectId,
    user,
}: IEditProjectPage): JSX.Element => {
    const router = useRouter()

    const customersResponse = useCustomers(user)
    const employeesResponse = useEmployees(user)
    const projectDetailResponse = useProjectDetail(projectId, user)

    const errorMessage =
        (customersResponse.isError && customersResponse.errorMessage) ||
        (employeesResponse.isError && employeesResponse.errorMessage) ||
        (projectDetailResponse.isError && projectDetailResponse.errorMessage) ||
        ""

    const redirectToProjectDetail = () => router.push(`/project/${projectId}`)

    return (
        <FormPage header="Edit project">
            <Box>
                {(customersResponse.isLoading ||
                    employeesResponse.isLoading ||
                    projectDetailResponse.isLoading) && <Loading />}
                {(customersResponse.isError ||
                    employeesResponse.isError ||
                    projectDetailResponse.isError) && (
                    <ErrorAlert title={errorMessage} message={errorMessage} />
                )}
                {customersResponse.isSuccess &&
                    employeesResponse.isSuccess &&
                    projectDetailResponse.isSuccess &&
                    projectDetailResponse.data.id && (
                        <EditProjectForm
                            customers={customersResponse.data}
                            employees={employeesResponse.data}
                            project={projectDetailResponse.data}
                            afterSubmit={redirectToProjectDetail}
                            onCancel={redirectToProjectDetail}
                            user={user}
                        />
                    )}
            </Box>
        </FormPage>
    )
}

const Edit: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return (
        <UserContext.Consumer>
            {({ user }) =>
                id ? (
                    <EditProjectPage projectId={Number(id)} user={user} />
                ) : null
            }
        </UserContext.Consumer>
    )
}

export default Edit

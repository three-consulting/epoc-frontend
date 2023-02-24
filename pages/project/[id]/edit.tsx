import React, { useContext } from "react"
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

type Props = {
    projectId: number
}

function EditProjectPage({ projectId }: Props): JSX.Element {
    const router = useRouter()
    const { user } = useContext(UserContext)

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
    return id ? <EditProjectPage projectId={Number(id)} /> : null
}

export default Edit

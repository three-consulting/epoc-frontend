import React from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/dist/client/router"
import { EditEmployeeForm } from "@/components/form/EmployeeForm"
import { useEmployeeDetail } from "@/lib/hooks/useDetail"
import FormPage from "@/components/common/FormPage"
import { Box } from "@chakra-ui/react"

type Props = {
    employeeId: number
}

function EditEmployeePage({ employeeId }: Props): JSX.Element {
    const router = useRouter()

    const employeeDetailResponse = useEmployeeDetail(employeeId)

    const errorMessage =
        (employeeDetailResponse.isError &&
            employeeDetailResponse.errorMessage) ||
        ""

    const redirectToEmployeeDetail = () =>
        router.push(`/employee/${employeeId}`)

    return (
        <FormPage header="Employees">
            <Box>
                {employeeDetailResponse.isLoading && <Loading />}
                {employeeDetailResponse.isError && (
                    <ErrorAlert title={errorMessage} message={errorMessage} />
                )}
                {employeeDetailResponse.isSuccess &&
                    employeeDetailResponse.data.id && (
                        <EditEmployeeForm
                            employee={employeeDetailResponse.data}
                            afterSubmit={redirectToEmployeeDetail}
                            onCancel={redirectToEmployeeDetail}
                        />
                    )}
            </Box>
        </FormPage>
    )
}

const Edit: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <EditEmployeePage employeeId={Number(id)} /> : null
}

export default Edit

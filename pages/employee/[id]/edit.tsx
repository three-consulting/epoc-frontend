import React, { useContext } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/dist/client/router"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { EditEmployeeForm } from "@/components/form/EmployeeForm"
import { useEmployeeDetail } from "@/lib/hooks/useDetail"

type Props = {
    employeeId: number
}

function EditEmployeePage({ employeeId }: Props): JSX.Element {
    const router = useRouter()
    const { user } = useContext(UserContext)

    const employeeDetailResponse = useEmployeeDetail(employeeId, user)

    const errorMessage =
        (employeeDetailResponse.isError &&
            employeeDetailResponse.errorMessage) ||
        ""

    const redirectToEmployeeDetail = () =>
        router.push(`/employee/${employeeId}`)

    return (
        <div>
            <Heading fontWeight="black" margin="1rem 0rem">
                Edit employee
            </Heading>
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
        </div>
    )
}

const Edit: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <EditEmployeePage employeeId={Number(id)} /> : null
}

export default Edit

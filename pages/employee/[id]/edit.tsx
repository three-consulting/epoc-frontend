import React from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/dist/client/router"
import { EditEmployeeForm } from "@/components/form/EmployeeForm"
import { useEmployeeDetail } from "@/lib/hooks/useDetail"
import { User } from "firebase/auth"
import { FirebaseContext } from "@/lib/contexts/FirebaseAuthContext"

type Props = {
    employeeId: number
    user: User
}

function EditEmployeePage({ employeeId, user }: Props): JSX.Element {
    const router = useRouter()

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
                        user={user}
                    />
                )}
        </div>
    )
}

const Edit: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return (
        <FirebaseContext.Consumer>
            {({ user }) =>
                id && user ? (
                    <EditEmployeePage employeeId={Number(id)} user={user} />
                ) : null
            }
        </FirebaseContext.Consumer>
    )
}

export default Edit

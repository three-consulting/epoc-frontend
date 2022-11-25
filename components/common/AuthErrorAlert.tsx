import * as React from "react"
import ErrorAlert from "./ErrorAlert"

const AuthErrorAlert = (): JSX.Element => (
    <ErrorAlert
        title={"User is not an administrator: "}
        message={"You need to be an administrator to access this endpoint."}
    />
)

export default AuthErrorAlert

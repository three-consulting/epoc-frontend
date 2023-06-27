import { ApiGetResponse } from "@/lib/types/hooks"
import { Center, Spinner } from "@chakra-ui/react"
import React from "react"

type LoadingProps = {
    height?: string
    spinnerSize?: string
}

const Loading = ({ height, spinnerSize }: LoadingProps) => (
    <Center height={height || "100vh"}>
        <Spinner size={spinnerSize || "xl"} />
    </Center>
)

type AwaitRequestProps<T> = {
    req: ApiGetResponse<T>
    children: JSX.Element
    height?: string
    spinnerSize?: string
}

export const AwaitRequest = <T,>({
    req,
    children,
    height,
    spinnerSize,
}: AwaitRequestProps<T>): JSX.Element => {
    if (req.isLoading) {
        return <Loading height={height} spinnerSize={spinnerSize} />
    } else if (req.isError) {
        return <p>Error: {req.errorMessage}</p>
    }
    return req.isSuccess && <>{children}</>
}

export default Loading

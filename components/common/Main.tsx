import React, { ReactNode, useContext } from "react"
import { Box, Flex } from "@chakra-ui/react"
import LeftNav from "./LeftNav"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import FormPage from "./FormPage"
import Header from "./Header"

interface MainProps {
    children?: ReactNode
}

const PleaseLogInPage = () => (
    <FormPage header="Sign-in">
        <Header type="sub">{"Please log in to see stuff."}</Header>
    </FormPage>
)

const Main = ({ children }: MainProps): JSX.Element => {
    const { user } = useContext(AuthContext)

    return (
        <Flex
            flexDirection="row"
            alignContent="center"
            justifyContent="center"
            minHeight="100vh"
        >
            <LeftNav />
            <Box minWidth="40vw">{user ? children : <PleaseLogInPage />}</Box>
        </Flex>
    )
}

export default Main

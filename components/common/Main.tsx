import React, { ReactNode } from "react"
import { Box, Flex } from "@chakra-ui/react"
import LeftNav from "./LeftNav"
import { FirebaseContext } from "@/lib/contexts/FirebaseAuthContext"
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

const Main = ({ children }: MainProps): JSX.Element => (
    <FirebaseContext.Consumer>
        {({ user, role, signInWithGoogle, signOutAndClear }) => (
            <Flex
                flexDirection="row"
                alignContent="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <LeftNav
                    user={user}
                    role={role}
                    signInWithGoogle={signInWithGoogle}
                    signOutAndClear={signOutAndClear}
                />
                <Box minWidth="40vw">
                    {user ? children : <PleaseLogInPage />}
                </Box>
            </Flex>
        )}
    </FirebaseContext.Consumer>
)

export default Main

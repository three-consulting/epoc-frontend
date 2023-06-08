import React, { ReactNode, useContext } from "react"
import { Box, Flex } from "@chakra-ui/react"
import LeftNav from "./LeftNav"
import FormPage from "./FormPage"
import Header from "./Header"
import { MediaContext } from "@/lib/contexts/MediaContext"
import useFirebaseAuth from "@/lib/hooks/useFirebaseAuth"
import { AuthProvider } from "@/lib/contexts/FirebaseAuthContext"

interface MainProps {
    children?: ReactNode
}

const PleaseLogInPage = ({ isLarge }: { isLarge: boolean }) => (
    <FormPage header="Sign-in">
        <Box style={{ minWidth: isLarge ? "50vw" : undefined }}>
            <Header type="sub">{"Please log in to see stuff."}</Header>
        </Box>
    </FormPage>
)

const Main = ({ children }: MainProps): JSX.Element => {
    const auth = useFirebaseAuth()
    const { user } = auth
    const { isLarge } = useContext(MediaContext)
    return (
        <Flex
            flexDirection="row"
            alignContent="center"
            justifyContent="center"
            minHeight="100vh"
        >
            {isLarge && <LeftNav {...auth} />}
            <Box>
                {user && user.email ? (
                    <AuthProvider auth={{ ...auth, user, email: user.email }}>
                        {children}
                    </AuthProvider>
                ) : (
                    <PleaseLogInPage isLarge={isLarge} />
                )}
            </Box>
        </Flex>
    )
}

export default Main

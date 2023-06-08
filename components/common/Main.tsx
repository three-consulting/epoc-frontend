import React, { ReactNode, useContext } from "react"
import { Box, Flex } from "@chakra-ui/react"
import LeftNav from "./LeftNav"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import FormPage from "./FormPage"
import Header from "./Header"
import { MediaContext } from "@/lib/contexts/MediaContext"

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
    const { user } = useContext(AuthContext)

    const { isLarge } = useContext(MediaContext)
    return (
        <Flex
            flexDirection="row"
            alignContent="center"
            justifyContent="center"
            minHeight="100vh"
        >
            {isLarge && <LeftNav />}
            <Box>{user ? children : <PleaseLogInPage isLarge={isLarge} />}</Box>
        </Flex>
    )
}

export default Main

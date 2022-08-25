import React, { ReactNode, useContext } from "react"
import { Box, Flex } from "@chakra-ui/react"
import LeftNav from "./LeftNav"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"

interface MainProps {
    children?: ReactNode
}

const Main = ({ children }: MainProps): JSX.Element => {
    const { user } = useContext(AuthContext)

    return (
        <Box
            display="block"
            flex="1 0 auto"
            marginLeft="5rem"
            marginRight="auto"
            paddingTop="1rem"
            paddingBottom="1rem"
            width={["95vw", "75vw", "62.5vw", "70vw"]}
        >
            <Flex
                flexDirection="row"
                alignContent="center"
                justifyContent="center"
            >
                <LeftNav />
                <Box minWidth="40vw">
                    {user ? children : <p>Please log in to see stuff.</p>}
                </Box>
            </Flex>
        </Box>
    )
}

export default Main

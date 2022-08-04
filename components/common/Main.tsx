import React, { ReactNode } from "react"
import { Box, Flex } from "@chakra-ui/react"
import LeftNav from "./LeftNav"
import useFirebaseAuth from "@/lib/hooks/useFirebaseAuth"

interface MainProps {
    children?: ReactNode
}

const Main = ({ children }: MainProps): JSX.Element => {
    const { user, signInWithGoogle, signOutAndClear } = useFirebaseAuth()

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
                <LeftNav
                    user={user}
                    signInWithGoogle={signInWithGoogle}
                    signOutAndClear={signOutAndClear}
                />
                <Box minWidth="40vw">
                    {user ? children : <p>Please log in to see stuff.</p>}
                </Box>
            </Flex>
        </Box>
    )
}

export default Main

import React, { Dispatch, ReactNode, SetStateAction, useContext } from "react"
import { Box, Flex, useMediaQuery } from "@chakra-ui/react"
import Navigations from "./Navigations"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import FormPage from "./FormPage"
import Header from "./Header"

interface MainProps {
    children?: ReactNode
    showNavigations?: boolean
    setShowNavigations?: Dispatch<SetStateAction<boolean>>
}

const PleaseLogInPage = () => (
    <FormPage header="Sign-in">
        <Header type="sub">{"Please log in to see stuff."}</Header>
    </FormPage>
)

const Main = ({ children, showNavigations }: MainProps): JSX.Element => {
    const { user } = useContext(AuthContext)
    const [isLarge] = useMediaQuery("(min-width: 800px)")

    return (
        <>
            {isLarge ? (
                <Flex
                    flexDirection="row"
                    alignContent="center"
                    justifyContent="center"
                    minHeight="100vh"
                >
                    <Navigations />
                    <Box minWidth="40vw">
                        {user ? children : <PleaseLogInPage />}
                    </Box>
                </Flex>
            ) : (
                <>
                    {showNavigations ? (
                        <Navigations />
                    ) : (
                        <Box width="100%" minHeight="100vh">
                            {user ? children : <PleaseLogInPage />}
                        </Box>
                    )}
                </>
            )}
        </>
    )
}

export default Main

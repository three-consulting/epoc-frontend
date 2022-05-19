import React, { ReactNode } from "react"
import Header from "./Header"
import Main from "./Main"
import { Flex } from "@chakra-ui/react"

interface LayoutProps {
    children?: ReactNode
}

function Layout({ children }: LayoutProps): JSX.Element {
    return (
        <Flex
            flexDirection="column"
            minHeight="100vh"
            backgroundColor="#efefef"
        >
            <Header />
            <Main>{children}</Main>
        </Flex>
    )
}

export default Layout

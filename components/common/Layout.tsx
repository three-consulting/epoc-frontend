import React, { ReactNode } from "react"
import Header from "./Header"
import Main from "./Main"
import { Flex } from "@chakra-ui/react"

interface LayoutProps {
    children?: ReactNode
}

const Layout = (props: LayoutProps): JSX.Element => {
    const { children } = props
    return (
        <Flex
            flexDirection="column"
            minHeight="100vh"
            background="linear-gradient(#9f9f9f, #efefef)"
        >
            <Header type="top" />
            <Main>{children}</Main>
        </Flex>
    )
}

export default Layout

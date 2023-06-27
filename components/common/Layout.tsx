import { MediaContext } from "@/lib/contexts/MediaContext"
import { Container } from "@chakra-ui/react"
import React, { useContext } from "react"
import Sidebar from "./Sidebar"

type BaseProps = {
    children: JSX.Element
}

const Base = ({ children }: BaseProps) => {
    const { isLarge } = useContext(MediaContext)
    return (
        <Container
            background={"white"}
            maxW="container.xl"
            p={isLarge ? "16" : "4"}
            minH={"100vh"}
            overflowY="scroll"
        >
            {children}
        </Container>
    )
}

type LayoutProps = {
    children: JSX.Element
}

const Layout = ({ children }: LayoutProps) => (
    <Sidebar>
        <Base>{children}</Base>
    </Sidebar>
)

export default Layout

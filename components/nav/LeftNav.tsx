import React from "react"
import { Flex } from "@chakra-ui/react"
import NavList from "./NavList"

const LeftNav = (): JSX.Element => (
    <Flex
        flexDirection="column"
        justifyContent="left"
        minHeight="100vh"
        minWidth="16rem"
        backgroundColor="black"
    >
        <NavList />
    </Flex>
)

export default LeftNav

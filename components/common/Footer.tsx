import React from "react"
import { Box } from "@chakra-ui/react"
import NavBarMobile from "./NavBarMobile"
import { useMediaQuery } from "react-responsive"

function Footer(): JSX.Element {
    const isMobile = useMediaQuery({ query: "(max-width: 1224px)" })
    if (isMobile) {
        return (
            <Box borderTop="1px" borderColor="gray.400">
                <NavBarMobile />
            </Box>
        )
    }
    return <Box borderTop="1px" borderColor="gray.400" />
}

export default Footer

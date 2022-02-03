import React, { ReactNode } from "react"
import { Box, Flex } from "@chakra-ui/react"
import { useMediaQuery } from "react-responsive"
import LeftNav from "./LeftNav"

interface MainProps {
    children?: ReactNode
}

function Main({ children }: MainProps): JSX.Element {
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" })

    if (isTabletOrMobile) {
        return (
            <Box
                display="block"
                flex="1 0 auto"
                marginLeft="auto"
                marginRight="auto"
                paddingTop="1rem"
                paddingBottom="1rem"
                width={["95vw", "75vw", "62.5vw", "50vw"]}
            >
                {children}
            </Box>
        )
    }
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
                <Box minWidth="40vw">{children}</Box>
            </Flex>
        </Box>
    )
}

export default Main

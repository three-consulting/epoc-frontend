import React from "react"
import { SkeletonCircle, Box, SkeletonText } from "@chakra-ui/react"

function Loading(): JSX.Element {
    return (
        <Box padding="6" boxShadow="lg" bg="white">
            <SkeletonCircle size="10" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
        </Box>
    )
}

export default Loading

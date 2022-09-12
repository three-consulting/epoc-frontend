import { Project } from "@/lib/types/apiTypes"
import { toLocalDisplayDate } from "@/lib/utils/date"
import { Box, Flex, Heading } from "@chakra-ui/layout"
import React from "react"

type ProjectDetailProps = {
    project: Project
}

function ProjectDetail({ project }: ProjectDetailProps): JSX.Element {
    const {
        name,
        description,
        customer,
        startDate,
        endDate,
        status,
        managingEmployee,
    } = project
    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
        >
            <Heading>
                <Box>{name}</Box>
            </Heading>
            <Flex>Description: {description}</Flex>
            <Flex>Customer: {customer?.name}</Flex>
            <Flex>Start date: {toLocalDisplayDate(startDate)}</Flex>
            <Flex>End date: {endDate ? toLocalDisplayDate(endDate) : "-"}</Flex>
            <Flex>
                Managing employee: {managingEmployee?.firstName}{" "}
                {managingEmployee?.lastName}
            </Flex>
            <Flex>Project status: {status}</Flex>
        </Flex>
    )
}

export default ProjectDetail

import { Project } from "@/lib/types/apiTypes"
import { toLocalDisplayDate } from "@/lib/utils/date"
import { Flex } from "@chakra-ui/layout"
import React from "react"

type ProjectDetailProps = {
    project: Project
}

function ProjectDetail({ project }: ProjectDetailProps): JSX.Element {
    const {
        description,
        customer,
        startDate,
        endDate,
        status,
        managingEmployee,
    } = project
    return (
        <>
            <Flex>Description: {description}</Flex>
            <Flex>Customer: {customer?.name}</Flex>
            <Flex>Start date: {toLocalDisplayDate(startDate)}</Flex>
            <Flex>End date: {endDate ? toLocalDisplayDate(endDate) : "-"}</Flex>
            <Flex>
                Managing employee: {managingEmployee?.firstName}{" "}
                {managingEmployee?.lastName}
            </Flex>
            <Flex>Project status: {status}</Flex>
        </>
    )
}

export default ProjectDetail

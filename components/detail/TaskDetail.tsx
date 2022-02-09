import { Task } from "@/lib/types/apiTypes"
import { Box, Flex, Heading } from "@chakra-ui/layout"
import React from "react"

type TaskDetailProps = {
    task: Task
}

function TaskDetail({ task }: TaskDetailProps): JSX.Element {
    const { name, description, project, created, updated, billable, status } =
        task
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
            <Flex>Project id: {project.id}</Flex>
            <Flex>Project name: {project.name}</Flex>
            <Flex>Created: {created}</Flex>
            <Flex>Updated: {updated}</Flex>
            <Flex> Billable: {billable ? "yes" : "no"}</Flex>
            <Flex>Task status: {status}</Flex>
        </Flex>
    )
}

export default TaskDetail

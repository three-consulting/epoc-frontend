import { Task } from "@/lib/types/apiTypes"
import { Flex } from "@chakra-ui/layout"
import React from "react"

interface ITaskDetail {
    task: Task
}

const TaskDetail = ({ task }: ITaskDetail): JSX.Element => {
    const { description, project, created, updated, status } = task
    return (
        <>
            <Flex>Description: {description}</Flex>
            <Flex>Project id: {project.id}</Flex>
            <Flex>Project name: {project.name}</Flex>
            <Flex>Created: {created}</Flex>
            <Flex>Updated: {updated}</Flex>
            <Flex>Task status: {status}</Flex>
        </>
    )
}

export default TaskDetail

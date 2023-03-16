import { Task } from "@/lib/types/apiTypes"
import { Box } from "@chakra-ui/layout"
import { Tbody } from "@chakra-ui/react"
import { Table, Td, Th, Thead, Tr } from "@chakra-ui/table"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { StyledButton } from "../common/Buttons"
import FormButtons from "../common/FormButtons"
import FormSection from "../common/FormSection"

interface ITaskRow {
    task: Task
}

const TaskRow = ({ task }: ITaskRow): JSX.Element => (
    <Link href={`task/${task.id}`}>
        <Tr
            _hover={{
                backgroundColor: "#6f6f6f",
                color: "whitesmoke",
                cursor: "pointer",
            }}
        >
            <Td>{task.name}</Td>
        </Tr>
    </Link>
)

interface ITaskTable {
    tasks: Task[]
}

const TaskTable = ({ tasks }: ITaskTable): JSX.Element => {
    const router = useRouter()

    return (
        <FormSection header="Tasks">
            <>
                {tasks.filter((task) => task.status !== "ARCHIVED").length ? (
                    <Box borderWidth="1px" padding="1rem" marginBottom="1rem">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {tasks.map(
                                    (task) =>
                                        task.status !== "ARCHIVED" && (
                                            <TaskRow
                                                task={task}
                                                key={`${task.id}`}
                                            />
                                        )
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                ) : (
                    <Box borderWidth="1px" padding="1rem" marginBottom="1rem">
                        No tasks in this project.
                        <br />
                        To add a task click the button below.
                    </Box>
                )}
                <Box>
                    <FormButtons>
                        <StyledButton
                            buttontype="add"
                            onClick={() => router.push("/task/new")}
                        />
                    </FormButtons>
                </Box>
            </>
        </FormSection>
    )
}

export default TaskTable

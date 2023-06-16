import React, { useState } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useProjectDetail } from "@/lib/hooks/useDetail"
import { Task, Timesheet } from "@/lib/types/apiTypes"
import { Box, Button, Heading, HStack, useDisclosure } from "@chakra-ui/react"
import {
    useCustomers,
    useEmployees,
    useTasks,
    useTimesheets,
} from "@/lib/hooks/useList"
import TaskTable from "@/components/table/TaskTable"
import TimesheetTable from "@/components/table/TimesheetTable"
import { ChevronLeftIcon } from "@chakra-ui/icons"
import Link from "next/link"
import ProjectForm from "@/components/form/ProjectForm"
import {
    useUpdateProjects,
    useUpdateTasks,
    useUpdateTimesheets,
} from "@/lib/hooks/useUpdate"
import ItemDrawer from "@/components/common/ItemDrawer"
import TaskForm from "@/components/form/TaskForm"
import TimesheetForm from "@/components/form/TimesheetForm"

const DisplayProjectDetail = ({ id }: { id: number }) => {
    const projectResponse = useProjectDetail(id)
    const taskResponse = useTasks()
    const timesheetResponse = useTimesheets(id)
    const employeesResponse = useEmployees()
    const customersResponse = useCustomers()

    const { put: putProject } = useUpdateProjects()
    const { post: postTimesheet, put: putTimesheet } = useUpdateTimesheets()
    const { post: postTask, put: putTask } = useUpdateTasks()

    const projectDisclosure = useDisclosure()
    const timesheetDisclosure = useDisclosure()
    const taskDisclosure = useDisclosure()

    const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet>()
    const [selectedTask, setSelectedTask] = useState<Task>()

    const timesheetActionButton = {
        text: "Create timesheet",
        onClick: timesheetDisclosure.onOpen,
    }
    const taskActionButton = {
        text: "Create task",
        onClick: taskDisclosure.onOpen,
    }

    const filterTaskByProject = (task: Task) => task.project.id === id

    return (
        <Box>
            {projectDisclosure.isOpen &&
                projectResponse.isSuccess &&
                employeesResponse.isSuccess &&
                customersResponse.isSuccess && (
                    <ItemDrawer
                        isOpen={projectDisclosure.isOpen}
                        onClose={projectDisclosure.onClose}
                    >
                        <ProjectForm
                            project={projectResponse.data}
                            onSubmit={(project) =>
                                putProject(project, () => undefined)
                            }
                            employees={employeesResponse.data}
                            customers={customersResponse.data}
                        />
                    </ItemDrawer>
                )}
            <HStack mb={8} spacing="24px">
                <Link href="/organization">
                    <Button>
                        <ChevronLeftIcon />
                    </Button>
                </Link>
                <Button
                    background={"green.300"}
                    color="white"
                    onClick={projectDisclosure.onOpen}
                >
                    Edit project
                </Button>
            </HStack>
            <Heading as="h1" mb={16}>
                {projectResponse.isSuccess && projectResponse.data.name}
            </Heading>
            <Heading as="h2" size="md">
                Timesheets
            </Heading>
            {selectedTimesheet && employeesResponse.isSuccess && (
                <ItemDrawer
                    isOpen={Boolean(selectedTimesheet)}
                    onClose={() => setSelectedTimesheet(undefined)}
                >
                    <TimesheetForm
                        timesheet={selectedTimesheet}
                        employees={employeesResponse.data}
                        onSubmit={(timesheet) =>
                            putTimesheet(timesheet, () => undefined)
                        }
                    />
                </ItemDrawer>
            )}
            {timesheetDisclosure.isOpen &&
                projectResponse.isSuccess &&
                employeesResponse.isSuccess && (
                    <ItemDrawer {...timesheetDisclosure}>
                        <TimesheetForm
                            timesheet={{ project: projectResponse.data }}
                            employees={employeesResponse.data}
                            onSubmit={(timesheet) =>
                                postTimesheet(timesheet, () => undefined)
                            }
                        />
                    </ItemDrawer>
                )}
            <TimesheetTable
                response={timesheetResponse}
                actionButton={timesheetActionButton}
                onOpenDetail={setSelectedTimesheet}
            />
            <Heading as="h2" size="md">
                Tasks
            </Heading>
            {taskDisclosure.isOpen && projectResponse.isSuccess && (
                <ItemDrawer {...taskDisclosure}>
                    <TaskForm
                        task={{ project: projectResponse.data }}
                        onSubmit={(task) => postTask(task, () => undefined)}
                    />
                </ItemDrawer>
            )}
            {selectedTask && (
                <ItemDrawer
                    isOpen={Boolean(selectedTask)}
                    onClose={() => setSelectedTask(undefined)}
                >
                    <TaskForm
                        task={selectedTask}
                        onSubmit={(task) => putTask(task, () => undefined)}
                    />
                </ItemDrawer>
            )}
            <TaskTable
                response={taskResponse}
                customFilters={[filterTaskByProject]}
                actionButton={taskActionButton}
                onOpenDetail={setSelectedTask}
            />
        </Box>
    )
}

const ProjectDetail: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <DisplayProjectDetail id={Number(id)} /> : <></>
}

export default ProjectDetail

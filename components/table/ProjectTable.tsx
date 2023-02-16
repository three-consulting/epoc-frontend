import React, { useState } from "react"
import { Box } from "@chakra-ui/layout"
import {
    Table,
    Thead,
    Tr,
    Td,
    Th,
    Tbody,
    FormControl,
    FormLabel,
    Switch,
} from "@chakra-ui/react"
import Link from "next/link"
import { Project } from "@/lib/types/apiTypes"
import FormSection from "../common/FormSection"
import { useRouter } from "next/router"
import FormButtons from "../common/FormButtons"
import { StyledButton } from "../common/Buttons"

interface ProjectRowProps {
    project: Project
}

function ProjectRow({ project }: ProjectRowProps) {
    return (
        <Link href={`project/${project.id}`}>
            <Tr _hover={{ backgroundColor: "gray.200", cursor: "pointer" }}>
                <Td>{project.name}</Td>
                <Td>{project.customer?.name}</Td>
            </Tr>
        </Link>
    )
}

interface ProjectTableProps {
    projects: Project[]
}

function ProjectTable({ projects }: ProjectTableProps): JSX.Element {
    const router = useRouter()

    const activePropjects = projects.filter((prj) => prj.status === "ACTIVE")
    const archivedProjects = projects.filter((prj) => prj.status === "ARCHIVED")

    const [showArchived, setShowArchived] = useState<boolean>(false)

    return (
        <>
            <FormSection
                header={
                    activePropjects
                        ? "Active projects"
                        : "No active projects found"
                }
            >
                <>
                    {activePropjects.length > 0 && (
                        <Box>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Name</Th>
                                        <Th>Client</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {activePropjects.map((project) => (
                                        <ProjectRow
                                            project={project}
                                            key={`${project.id}`}
                                        />
                                    ))}
                                </Tbody>
                            </Table>
                            <FormButtons>
                                <StyledButton
                                    buttontype="add"
                                    onClick={() => router.push("/project/new")}
                                    name="project"
                                />
                            </FormButtons>
                        </Box>
                    )}
                </>
            </FormSection>
            {archivedProjects.length > 0 && (
                <>
                    {showArchived && (
                        <FormSection
                            header={
                                archivedProjects
                                    ? "Archived projects"
                                    : "No archived projects found"
                            }
                        >
                            {archivedProjects && (
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Name</Th>
                                            <Th>Client</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {archivedProjects.map((project) => (
                                            <ProjectRow
                                                project={project}
                                                key={`${project.id}`}
                                            />
                                        ))}
                                    </Tbody>
                                </Table>
                            )}
                        </FormSection>
                    )}
                    <FormControl
                        display="flex"
                        alignItems="center"
                        paddingX="2rem"
                        paddingY="1rem"
                    >
                        <FormLabel
                            htmlFor="show-archived"
                            mb="0"
                            fontWeight="bold"
                        >
                            {"Show archived projects: "}
                        </FormLabel>
                        <Switch
                            id="show-archived"
                            onChange={() => setShowArchived((shw) => !shw)}
                        />
                    </FormControl>
                </>
            )}
        </>
    )
}

export default ProjectTable

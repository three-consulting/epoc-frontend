import React from "react"
import { Box } from "@chakra-ui/layout"
import { Table, Thead, Tr, Td, Th, Tbody } from "@chakra-ui/react"
import Link from "next/link"
import { Project } from "@/lib/types/apiTypes"
import FormSection from "../common/FormSection"
import { useRouter } from "next/router"
import FormButtons from "../common/FormButtons"
import { StyledButton } from "../common/Buttons"

interface ProjectRowProps {
    project: Project
}

const ProjectRow = ({ project }: ProjectRowProps) => (
    <Link href={`project/${project.id}`}>
        <Tr
            _hover={{
                backgroundColor: "#6f6f6f",
                color: "whitesmoke",
                cursor: "pointer",
            }}
        >
            <Td>{project.name}</Td>
            <Td>{project.customer?.name}</Td>
        </Tr>
    </Link>
)

interface IProjectTable {
    projects: Project[]
}

const ProjectTable = ({ projects }: IProjectTable): JSX.Element => {
    const router = useRouter()
    return (
        <FormSection header={projects ? "All projects" : "No projects found"}>
            {projects && (
                <Box>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Client</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {projects.map((project) => (
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
        </FormSection>
    )
}

export default ProjectTable

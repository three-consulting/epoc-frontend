import React, { useContext } from "react"
import type { NextPage } from "next"
import { Box, Heading } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
import ProjectTable from "@/components/table/ProjectTable"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useProjects } from "@/lib/hooks/useList"

const Projects: NextPage = () => {
    const router = useRouter()
    const { user } = useContext(UserContext)
    const projectsResponse = useProjects(user)

    return (
        <div>
            <Heading fontWeight="black" margin="1rem 0rem">
                Projects
            </Heading>
            {projectsResponse.isLoading && <Loading />}
            {projectsResponse.isError && (
                <ErrorAlert
                    title={projectsResponse.errorMessage}
                    message={projectsResponse.errorMessage}
                />
            )}
            {projectsResponse.isSuccess && (
                <ProjectTable projects={projectsResponse.data} />
            )}
            <Box margin="1rem 0rem">
                <Button
                    colorScheme="blue"
                    onClick={() => router.push("/project/new")}
                >
                    Add project
                </Button>
            </Box>
        </div>
    )
}

export default Projects

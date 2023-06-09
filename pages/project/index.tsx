import React, { useContext } from "react"
import type { NextPage } from "next"
import ProjectTable from "@/components/table/ProjectTable"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import { useProjects } from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"

const Projects: NextPage = () => {
    const { user } = useContext(AuthContext)
    const projectsResponse = useProjects(user)

    return (
        <FormPage header="Projects">
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
        </FormPage>
    )
}

export default Projects

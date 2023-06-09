import React from "react"
import type { NextPage } from "next"
import ProjectTable from "@/components/table/ProjectTable"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useProjects } from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"

const Projects: NextPage = () => {
    const projectsResponse = useProjects()

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

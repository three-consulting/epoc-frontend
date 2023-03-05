import React from "react"
import type { NextPage } from "next"
import ProjectTable from "@/components/table/ProjectTable"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useProjects } from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"
import { User } from "firebase/auth"
import { FirebaseContext } from "@/lib/contexts/FirebaseAuthContext"

interface IProjectsForm {
    user: User
}

const ProjectsForm = ({ user }: IProjectsForm) => {
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

const Projects: NextPage = () => (
    <FirebaseContext.Consumer>
        {({ user }) => user && <ProjectsForm user={user} />}
    </FirebaseContext.Consumer>
)

export default Projects

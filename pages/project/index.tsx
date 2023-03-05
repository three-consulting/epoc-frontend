import React from "react"
import type { NextPage } from "next"
import ProjectTable from "@/components/table/ProjectTable"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useProjects } from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"
import { User } from "firebase/auth"

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
    <UserContext.Consumer>
        {({ user }) => <ProjectsForm user={user} />}
    </UserContext.Consumer>
)

export default Projects

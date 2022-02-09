import React from "react"
import type { NextPage } from "next"
import { Box, Heading } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
import Layout from "@/components/common/Layout"
import ProjectTable from "@/components/table/ProjectTable"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useProjects } from "@/lib/hooks/useProjects"
import { useCustomers } from "@/lib/hooks/useCustomers"
import CustomerTable from "@/components/table/CustomerTable"

const Projects: NextPage = () => {
    const router = useRouter()
    const projectsResponse = useProjects()
    const customersResponse = useCustomers()

    return (
        <Layout>
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
            <Heading fontWeight="black" margin="1rem 0rem">
                Customers
            </Heading>
            {customersResponse.isLoading && <Loading />}
            {customersResponse.isError && (
                <ErrorAlert
                    title={customersResponse.errorMessage}
                    message={customersResponse.errorMessage}
                />
            )}
            {customersResponse.isSuccess && (
                <CustomerTable customers={customersResponse.data} />
            )}
        </Layout>
    )
}

export default Projects

import ItemDrawer from "@/components/common/ItemDrawer"
import CustomerForm from "@/components/form/CustomerForm"
import EmployeeForm from "@/components/form/EmployeeForm"
import ProjectForm from "@/components/form/ProjectForm"
import CustomerTable from "@/components/table/CustomerTable"
import EmployeeTable from "@/components/table/EmployeeTable"
import ProjectTable from "@/components/table/ProjectTable"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import { prefixEndpoint, getAndMutate } from "@/lib/hooks/swrInterface"
import { useCustomers, useEmployees, useProjects } from "@/lib/hooks/useList"
import {
    useUpdateCustomers,
    useUpdateEmployees,
    useUpdateProjects,
} from "@/lib/hooks/useUpdate"
import { Customer, Employee } from "@/lib/types/apiTypes"
import { Box, Heading, useDisclosure } from "@chakra-ui/react"
import { NextPage } from "next"
import React, { useContext, useState } from "react"

const Organization: NextPage = () => {
    const projectResponse = useProjects()
    const employeeResponse = useEmployees()
    const customerResponse = useCustomers()

    const { post: postProject } = useUpdateProjects()
    const { put: putEmployee } = useUpdateEmployees()
    const { post: postCustomer, put: putCustomer } = useUpdateCustomers()

    const projectDisclosure = useDisclosure()
    const customerDisclosure = useDisclosure()

    const [selectedEmployee, setSelectedEmployee] = useState<Employee>()
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>()

    const [isLoading, setIsLoading] = useState(false)
    const { user } = useContext(AuthContext)
    const syncUrl = `${prefixEndpoint("employee")}/employee-sync`
    const syncEmployees = async () => {
        setIsLoading(true)
        await getAndMutate(syncUrl, ["employee"], user)
        setIsLoading(false)
    }

    const projectActionButton = {
        text: "Create project",
        onClick: projectDisclosure.onOpen,
    }
    const employeeActionButton = {
        text: "Sync employees",
        onClick: syncEmployees,
        isLoading,
    }
    const customerActionButton = {
        text: "Create customer",
        onClick: customerDisclosure.onOpen,
    }

    return (
        <Box>
            <Heading as="h1" mb={16}>
                Organization
            </Heading>
            <Heading as="h3" size="md">
                Projects
            </Heading>
            {projectDisclosure.isOpen &&
                customerResponse.isSuccess &&
                employeeResponse.isSuccess && (
                    <ItemDrawer
                        {...projectDisclosure}
                        onClose={projectDisclosure.onClose}
                    >
                        <ProjectForm
                            project={{}}
                            customers={customerResponse.data}
                            employees={employeeResponse.data}
                            onSubmit={async (project) => {
                                await postProject(project, () => undefined)
                                projectDisclosure.onClose()
                            }}
                        />
                    </ItemDrawer>
                )}
            <ProjectTable
                response={projectResponse}
                actionButton={projectActionButton}
            />
            <Heading as="h3" size="md">
                Employees
            </Heading>
            {selectedEmployee && (
                <ItemDrawer
                    isOpen={Boolean(selectedEmployee)}
                    onClose={() => setSelectedEmployee(undefined)}
                >
                    <EmployeeForm
                        employee={selectedEmployee}
                        onSubmit={async (employee) => {
                            await putEmployee(employee, () => undefined)
                            setSelectedEmployee(undefined)
                            syncEmployees()
                        }}
                    />
                </ItemDrawer>
            )}
            <EmployeeTable
                response={employeeResponse}
                onOpenDetail={setSelectedEmployee}
                actionButton={employeeActionButton}
            />
            <Heading as="h3" size="md">
                Customers
            </Heading>
            {customerDisclosure.isOpen && (
                <ItemDrawer
                    {...customerDisclosure}
                    onClose={customerDisclosure.onClose}
                >
                    <CustomerForm
                        onSubmit={async (customer) => {
                            await postCustomer(customer, () => undefined)
                            customerDisclosure.onClose()
                        }}
                        customer={{}}
                    />
                </ItemDrawer>
            )}
            {selectedCustomer && (
                <ItemDrawer
                    isOpen={Boolean(selectedCustomer)}
                    onClose={() => {
                        setSelectedCustomer(undefined)
                    }}
                >
                    <CustomerForm
                        customer={selectedCustomer}
                        onSubmit={async (customer) => {
                            await putCustomer(customer, () => undefined)
                            setSelectedCustomer(undefined)
                        }}
                    />
                </ItemDrawer>
            )}
            <CustomerTable
                response={customerResponse}
                actionButton={customerActionButton}
                onOpenDetail={setSelectedCustomer}
            />
        </Box>
    )
}

export default Organization

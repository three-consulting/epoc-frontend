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
import { ApiGetResponse } from "@/lib/types/hooks"
import { Box, Heading, useDisclosure } from "@chakra-ui/react"
import { User } from "@firebase/auth"
import { NextPage } from "next"
import React, { useContext, useState } from "react"

type EmployeeViewProps = {
    employeeResponse: ApiGetResponse<Employee[]>
    user: User
}

const EmployeeView = ({ employeeResponse, user }: EmployeeViewProps) => {
    const { put: putEmployee } = useUpdateEmployees()
    const [selectedEmployee, setSelectedEmployee] = useState<Employee>()

    const [isLoading, setIsLoading] = useState(false)
    const syncUrl = `${prefixEndpoint("employee")}/employee-sync`
    const syncEmployees = async () => {
        setIsLoading(true)
        await getAndMutate(syncUrl, ["employee"], user)
        setIsLoading(false)
    }
    const employeeActionButton = {
        text: "Sync employees",
        onClick: syncEmployees,
        isLoading,
    }

    return (
        <>
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
                            const updated = await putEmployee(
                                employee,
                                () => undefined
                            )
                            syncEmployees()
                            return updated
                        }}
                    />
                </ItemDrawer>
            )}
            <EmployeeTable
                response={employeeResponse}
                onOpenDetail={setSelectedEmployee}
                actionButton={employeeActionButton}
            />
        </>
    )
}

const Organization: NextPage = () => {
    const { user, role } = useContext(AuthContext)

    const projectResponse = useProjects()
    const customerResponse = useCustomers()
    const employeeResponse = useEmployees()

    const { post: postProject } = useUpdateProjects()
    const { post: postCustomer, put: putCustomer } = useUpdateCustomers()

    const projectDisclosure = useDisclosure()
    const customerDisclosure = useDisclosure()

    const [selectedCustomer, setSelectedCustomer] = useState<Customer>()

    const projectActionButton = {
        text: "Create project",
        onClick: projectDisclosure.onOpen,
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
                            onSubmit={(project) =>
                                postProject(project, () => undefined)
                            }
                        />
                    </ItemDrawer>
                )}
            <ProjectTable
                response={projectResponse}
                actionButton={projectActionButton}
            />
            {role === "ADMIN" && (
                <EmployeeView employeeResponse={employeeResponse} user={user} />
            )}
            <Heading as="h3" size="md">
                Customers
            </Heading>
            {customerDisclosure.isOpen && (
                <ItemDrawer
                    {...customerDisclosure}
                    onClose={customerDisclosure.onClose}
                >
                    <CustomerForm
                        onSubmit={(customer) =>
                            postCustomer(customer, () => undefined)
                        }
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
                        onSubmit={(customer) =>
                            putCustomer(customer, () => undefined)
                        }
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

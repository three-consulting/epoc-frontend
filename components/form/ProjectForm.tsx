import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateProjects } from "@/lib/hooks/useUpdate"
import { Customer, Employee, Project } from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import { Flex } from "@chakra-ui/layout"
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Box,
} from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import ErrorAlert from "../common/ErrorAlert"
import { FromButton, NewCustomerModal } from "../common/FormFields"

type CreateProjectFormProps = FormBase<Project> & {
    employees: Employee[]
    customers: Customer[]
}

type EditProjectFormProps = CreateProjectFormProps & {
    project: Project
}

type ProjectFormProps = CreateProjectFormProps & {
    project?: Project
    onSubmit: (project: Project) => void
}

type ProjectFields = Partial<Project>

const validateProjectFields = (form: ProjectFields): Project => {
    const { name, startDate, customer, managingEmployee } = form
    if (name && startDate && customer && managingEmployee) {
        return {
            ...form,
            name,
            startDate,
            customer,
            managingEmployee,
        }
    }
    throw Error("Invalid project form: missing required fields")
}

function ProjectForm({
    project: projectOrNull,
    customers,
    employees,
    onSubmit,
    onCancel,
}: ProjectFormProps) {
    const [projectFields, setProjectFields] = useState<ProjectFields>(
        projectOrNull || {}
    )
    const [displayCreateCustomerForm, setDisplayCreateCustomerForm] =
        useState(false)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const handleCustomerChange = (
        event: React.FormEvent<HTMLSelectElement>
    ) => {
        event.preventDefault()
        const id = event.currentTarget.value
        if (id) {
            const customer = customers.find(
                (customerIterator) => customerIterator.id === Number(id)
            )
            setProjectFields({ ...projectFields, customer })
        }
    }

    const handleEmployeeChange = (
        event: React.FormEvent<HTMLSelectElement>
    ) => {
        event.preventDefault()
        const id = event.currentTarget.value
        if (id) {
            const employee = employees.find(
                (employeeIterator) => employeeIterator.id === Number(id)
            )
            setProjectFields({ ...projectFields, managingEmployee: employee })
        }
    }

    const invalidEndDate =
        (projectFields.startDate &&
            projectFields.endDate &&
            projectFields.startDate > projectFields.endDate) ||
        false

    const abortSubmission = onCancel && onCancel

    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    try {
                        const project = validateProjectFields(projectFields)
                        onSubmit(project)
                    } catch (error) {
                        errorHandler(error as Error)
                    }
                }}
            >
                <FormControl isRequired={true}>
                    <FormLabel>Project name</FormLabel>
                    <Input
                        value={projectFields.name || ""}
                        placeholder="Project name"
                        onChange={(event) =>
                            setProjectFields({
                                ...projectFields,
                                name: event.target.value,
                            })
                        }
                        data-testid={"form-field-name"}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Project description</FormLabel>
                    <Input
                        value={projectFields.description || ""}
                        placeholder="Project description"
                        onChange={(event) =>
                            setProjectFields({
                                ...projectFields,
                                description: event.target.value,
                            })
                        }
                        data-testid={"form-field-description"}
                    />
                </FormControl>
                <FormControl isRequired={true}>
                    <FormLabel>Start date</FormLabel>
                    <Input
                        type="date"
                        value={projectFields.startDate || ""}
                        placeholder="Project start date"
                        onChange={(event) =>
                            setProjectFields({
                                ...projectFields,
                                startDate: event.target.value,
                            })
                        }
                        data-testid={"form-field-start-date"}
                    />
                </FormControl>
                <FormControl isInvalid={invalidEndDate}>
                    <FormLabel>End date</FormLabel>
                    <Input
                        type="date"
                        value={projectFields.endDate || ""}
                        placeholder="Project end date"
                        onChange={(event) =>
                            setProjectFields({
                                ...projectFields,
                                endDate: event.target.value,
                            })
                        }
                        data-testid={"form-field-end-date"}
                    />
                    <FormErrorMessage>
                        End date precedes start date
                    </FormErrorMessage>
                </FormControl>
                <Flex flexDirection="row" justifyContent="center">
                    <FormControl isRequired={true}>
                        <FormLabel>Customer</FormLabel>
                        <Flex
                            flexDirection="row"
                            justifyContent="space-between"
                        >
                            <Select
                                onChange={handleCustomerChange}
                                placeholder="Select customer"
                                marginRight="0.3rem"
                                value={projectFields.customer?.id}
                                data-testid={"form-field-customer"}
                            >
                                {customers.map((customer, idx) => (
                                    <option key={idx} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </Select>

                            <FromButton
                                buttonName="Add Customer"
                                onClick={() =>
                                    setDisplayCreateCustomerForm(true)
                                }
                            />
                            <NewCustomerModal
                                displayCreateCustomerForm={
                                    displayCreateCustomerForm
                                }
                                setDisplayCreateCustomerForm={
                                    setDisplayCreateCustomerForm
                                }
                            />
                        </Flex>
                    </FormControl>
                </Flex>
                <FormControl isRequired={true}>
                    <FormLabel>Managing employee</FormLabel>
                    <Select
                        onChange={handleEmployeeChange}
                        placeholder="Select employee"
                        value={projectFields.managingEmployee?.id}
                        data-testid={"form-field-managing-employee"}
                    >
                        {employees.map((employee, idx) => (
                            <option key={idx} value={employee.id}>
                                {`${employee.firstName} ${employee.lastName}`}
                            </option>
                        ))}
                    </Select>
                </FormControl>
                <br />
                <Button
                    colorScheme="blue"
                    type="submit"
                    data-testid={"form-button-submit"}
                >
                    Submit
                </Button>
                <Button
                    colorScheme="gray"
                    type="button"
                    marginLeft="0.5rem"
                    onClick={abortSubmission}
                    data-testid={"form-button-cancel"}
                >
                    Cancel
                </Button>
                {errorMessage && (
                    <>
                        <ErrorAlert />
                        <Box>{errorMessage}</Box>
                    </>
                )}
            </form>
        </Flex>
    )
}

export const CreateProjectForm = (
    props: CreateProjectFormProps
): JSX.Element => {
    const { user } = useContext(UserContext)
    const { post } = useUpdateProjects(user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (project: Project) => {
        const newProject = await post(project, errorHandler)
        return props.afterSubmit && props.afterSubmit(newProject)
    }

    return (
        <>
            <ProjectForm {...props} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}

export const EditProjectForm = (props: EditProjectFormProps): JSX.Element => {
    const { user } = useContext(UserContext)
    const { put } = useUpdateProjects(user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (project: Project) => {
        const updatedProject = await put(project, errorHandler)
        return props.afterSubmit && props.afterSubmit(updatedProject)
    }

    return (
        <>
            <ProjectForm {...props} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}

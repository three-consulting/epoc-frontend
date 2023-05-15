import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateProjects } from "@/lib/hooks/useUpdate"
import { Customer, Employee, Project } from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import { projectFieldMetadata } from "@/lib/types/typeMetadata"
import { Flex } from "@chakra-ui/layout"
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Box,
} from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import ErrorAlert from "../common/ErrorAlert"
import FormSection from "../common/FormSection"
import { NewCustomerModal } from "../common/FormFields"
import FormButtons from "../common/FormButtons"
import { StyledButton } from "../common/Buttons"

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const project = validateProjectFields(projectFields)
            onSubmit(project)
        } catch (error) {
            errorHandler(error as Error)
        }
    }

    const invalidEndDate =
        (projectFields.startDate &&
            projectFields.endDate &&
            projectFields.startDate > projectFields.endDate) ||
        false

    const abortSubmission = onCancel && onCancel

    const activeEmployees = employees.filter(
        (employee) => employee.status === "ACTIVE"
    )

    return (
        <FormSection
            header={projectFields.name || "-"}
            errorMessage={errorMessage}
        >
            <Box>
                <form onSubmit={handleSubmit}>
                    <FormControl
                        isRequired={projectFieldMetadata.name.required}
                    >
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
                    <FormControl
                        isRequired={projectFieldMetadata.description.required}
                    >
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
                    <FormControl
                        isRequired={projectFieldMetadata.startDate.required}
                    >
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
                    <FormControl
                        isRequired={projectFieldMetadata.endDate.required}
                        isInvalid={invalidEndDate}
                    >
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
                    <Flex justifyContent="center">
                        <FormControl
                            isRequired={projectFieldMetadata.customer.required}
                        >
                            <FormLabel>Customer</FormLabel>
                            <Flex
                                flexDirection="row"
                                justifyContent="space-between"
                            >
                                <Select
                                    onChange={handleCustomerChange}
                                    marginRight="0.3rem"
                                    value={projectFields.customer?.id}
                                    data-testid={"form-field-customer"}
                                >
                                    {customers.map((customer) => (
                                        <option
                                            key={`${customer.id}`}
                                            value={customer.id}
                                        >
                                            {customer.name}
                                        </option>
                                    ))}
                                    <option
                                        selected
                                        hidden
                                        disabled
                                        value="Customer name"
                                    >
                                        Select customer
                                    </option>
                                </Select>

                                <StyledButton
                                    buttontype="add"
                                    name="Customer"
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
                    <FormControl
                        isRequired={
                            projectFieldMetadata.managingEmployee.required
                        }
                    >
                        <FormLabel>Managing employee</FormLabel>
                        <Select
                            onChange={handleEmployeeChange}
                            value={projectFields.managingEmployee?.id}
                            data-testid={"form-field-managing-employee"}
                        >
                            {activeEmployees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {`${employee.firstName} ${employee.lastName}`}
                                </option>
                            ))}
                            <option
                                selected
                                hidden
                                disabled
                                value="Employee name"
                            >
                                Select employee
                            </option>
                        </Select>
                    </FormControl>
                    <FormButtons>
                        <StyledButton
                            buttontype="submit"
                            type="submit"
                            data-testid={"form-button-submit"}
                        />
                        <StyledButton
                            buttontype="cancel"
                            type="button"
                            onClick={abortSubmission}
                            data-testid={"form-button-cancel"}
                        />
                    </FormButtons>
                </form>
            </Box>
        </FormSection>
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

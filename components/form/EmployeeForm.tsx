import {
    FormControl,
    FormLabel,
    Input,
    Box,
    Flex,
    Select,
} from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { Employee } from "@/lib/types/apiTypes"
import { useUpdateEmployees } from "@/lib/hooks/useUpdate"
import { FormBase } from "@/lib/types/forms"
import ErrorAlert from "../common/ErrorAlert"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { employeeFieldMetadata } from "@/lib/types/typeMetadata"
import WarningModal from "../common/WarningModal"
import FormButtons from "../common/FormButtons"
import { StyledButton } from "../common/Buttons"
import { isError } from "lodash"

type CreateEmployeeFormProps = FormBase<Employee>

type EditEmployeeFormProps = CreateEmployeeFormProps & {
    employee: Employee
}

type EmployeeFormProps = CreateEmployeeFormProps & {
    employee?: Employee
    onSubmit: (employee: Employee) => void
    onCancel?: () => void
}

type EmployeeFields = Partial<Employee>

const validateEmployeeFields = (fields: EmployeeFields): Employee => {
    const { firstName, lastName, email, role } = fields
    if (!firstName) {
        throw Error("Invalid employee form: missing required field firstName")
    }
    if (!lastName) {
        throw Error("Invalid employee form: missing required field lastName")
    }
    if (!email) {
        throw Error("Invalid employee form: missing required field email")
    }
    if (!role) {
        throw Error("Invalid employee form: missing required field role")
    }
    return fields as Employee
}

const EmployeeForm = ({ onSubmit, onCancel, employee }: EmployeeFormProps) => {
    const [disableSave, setDisableSave] = useState<boolean>(true)
    const [showWarningModal, setShowWarningModal] = useState<boolean>(false)
    const [employeeFields, setEmployeeFields] = useState<EmployeeFields>(
        employee || {}
    )

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    useEffect(() => {
        try {
            if (validateEmployeeFields(employeeFields)) {
                setDisableSave(false)
            }
        } catch (_err) {
            setDisableSave(true)
        }
    }, [employeeFields])

    const onConfirm = (event: React.MouseEvent) => {
        event.preventDefault()
        try {
            onSubmit(validateEmployeeFields(employeeFields))
        } catch (error) {
            if (isError(error)) {
                errorHandler(error)
            }
        }
    }

    const onFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setEmployeeFields({
            ...employeeFields,
            firstName: event.target.value,
        })

    const onLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setEmployeeFields({
            ...employeeFields,
            lastName: event.target.value,
        })

    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setEmployeeFields({
            ...employeeFields,
            email: event.target.value,
        })

    const onRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
        setEmployeeFields({
            ...employeeFields,
            role:
                event.target.value === "ADMIN" || event.target.value === "USER"
                    ? event.target.value
                    : "USER",
        })

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
                        onSubmit(validateEmployeeFields(employeeFields))
                    } catch (error) {
                        errorHandler(error as Error)
                    }
                }}
            >
                <div style={{ padding: "20px" }}>
                    <FormControl
                        isRequired={employeeFieldMetadata.firstName.required}
                    >
                        <FormLabel>Employee First Name</FormLabel>
                        <Input
                            placeholder="Employee First Name"
                            value={employeeFields.firstName || ""}
                            onChange={onFirstNameChange}
                            data-testid={"form-field-firstName"}
                        />
                    </FormControl>

                    <FormControl
                        mt={4}
                        isRequired={employeeFieldMetadata.lastName.required}
                    >
                        <FormLabel>Employee Last Name</FormLabel>
                        <Input
                            placeholder="Employee Last Name"
                            value={employeeFields.lastName || ""}
                            onChange={onLastNameChange}
                            data-testid={"form-field-lastName"}
                        />
                    </FormControl>

                    <FormControl
                        mt={4}
                        isRequired={employeeFieldMetadata.email.required}
                    >
                        <FormLabel>Employee Email</FormLabel>
                        <Input
                            placeholder="Employee Email"
                            value={employeeFields.email || ""}
                            onChange={onEmailChange}
                            data-testid={"form-field-email"}
                        />
                    </FormControl>

                    <FormControl
                        mt={4}
                        isRequired={employeeFieldMetadata.role.required}
                    >
                        <FormLabel>Employee Role</FormLabel>
                        <Select
                            placeholder="Employee Role"
                            value={employeeFields.role || ""}
                            onChange={onRoleChange}
                            data-testid={"form-field-role"}
                        >
                            <option value={"USER"}>User</option>
                            <option value={"ADMIN"}>Admin</option>
                        </Select>
                    </FormControl>
                </div>
                <FormButtons>
                    <StyledButton
                        buttontype="save"
                        onClick={() => setShowWarningModal(true)}
                        disabled={disableSave}
                        data-testid="form-button-save"
                    />
                    <StyledButton
                        buttontype="cancel"
                        onClick={onCancel}
                        data-testid="form-button-cancel"
                    />
                </FormButtons>
                {errorMessage && (
                    <>
                        <ErrorAlert />
                        <Box>{errorMessage}</Box>
                    </>
                )}
                <WarningModal
                    header={"Are you sure?"}
                    content={
                        "Changes in this form will overwrite data in firebase"
                    }
                    buttons={
                        <FormButtons>
                            <StyledButton
                                buttontype="confirm"
                                onClick={onConfirm}
                                data-testid="form-button-confirm"
                            />
                            <StyledButton
                                buttontype="cancel"
                                onClick={() => setShowWarningModal(false)}
                            />
                        </FormButtons>
                    }
                    isOpen={showWarningModal}
                    onClose={() => setShowWarningModal(false)}
                />
            </form>
        </Flex>
    )
}

export const EditEmployeeForm = (props: EditEmployeeFormProps): JSX.Element => {
    const { user } = useContext(UserContext)
    const { put } = useUpdateEmployees(user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (employee: Employee) => {
        const updatedEmployee = await put(employee, errorHandler)
        return props.afterSubmit && props.afterSubmit(updatedEmployee)
    }

    return (
        <>
            <EmployeeForm {...props} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}

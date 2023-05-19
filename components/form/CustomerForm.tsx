import { FormControl, FormLabel, Input, Box } from "@chakra-ui/react"
import React, { Dispatch, SetStateAction, useContext, useState } from "react"
import { Customer } from "@/lib/types/apiTypes"
import { useUpdateCustomers } from "@/lib/hooks/useUpdate"
import { FormBase } from "@/lib/types/forms"
import ErrorAlert from "../common/ErrorAlert"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { customerFieldMetadata } from "@/lib/types/typeMetadata"
import FormSection from "../common/FormSection"
import StyledButtons from "../common/StyledButtons"
import { StyledButton } from "../common/Buttons"

type CustomerFormPropsBase = FormBase<Customer>
type CustomerFields = Partial<Customer>

interface CreateCustomerFormProps extends CustomerFormPropsBase {
    customer?: Customer | null
}

interface EditCustomerFormProps extends CustomerFormPropsBase {
    customer: Customer | null
}

type CustomerFormProps = CreateCustomerFormProps & {
    customerFields: CustomerFields
    setCustomerFields: Dispatch<SetStateAction<CustomerFields>>
    setErrorMessage: Dispatch<SetStateAction<string>>
    onSubmit: (customer: Customer) => void
}

const validateCustomerFields = (fields: CustomerFields): Customer => {
    const { name } = fields
    if (name) {
        return { ...fields, name }
    }
    throw Error("Invalid customer form: missing required fields")
}

function CustomerForm({
    customerFields,
    setCustomerFields,
    setErrorMessage,
    onSubmit,
    onCancel,
}: CustomerFormProps) {
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const abortSubmission = onCancel && onCancel

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                try {
                    const customer = validateCustomerFields(customerFields)
                    onSubmit(customer)
                } catch (error) {
                    errorHandler(error as Error)
                }
            }}
        >
            <FormControl isRequired={customerFieldMetadata.name.required}>
                <FormLabel>Customer Name</FormLabel>
                <Input
                    placeholder="Customer Name"
                    value={customerFields.name || ""}
                    onChange={(event) =>
                        setCustomerFields({
                            ...customerFields,
                            name: event.target.value,
                        })
                    }
                    data-testid={"form-field-name"}
                />
            </FormControl>

            <FormControl
                mt={4}
                isRequired={customerFieldMetadata.description.required}
            >
                <FormLabel>Description</FormLabel>
                <Input
                    placeholder="Description"
                    value={customerFields.description || ""}
                    onChange={(event) =>
                        setCustomerFields({
                            ...customerFields,
                            description: event.target.value,
                        })
                    }
                    data-testid={"form-field-description"}
                />
            </FormControl>
            <StyledButtons>
                <StyledButton
                    buttontype="save"
                    type="submit"
                    data-testid="form-button-submit"
                />
                <StyledButton
                    buttontype="cancel"
                    onClick={abortSubmission}
                    data-testid="form-button-cancel"
                />
            </StyledButtons>
        </form>
    )
}

export const CreateCustomerForm = (
    props: CreateCustomerFormProps
): JSX.Element => {
    const { user } = useContext(UserContext)
    const { post } = useUpdateCustomers(user)

    const { customer } = props

    const [customerFields, setCustomerFields] = useState<CustomerFields>(
        customer || {}
    )

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (cust: Customer) => {
        const newCustomer = await post(cust, errorHandler)
        return props.afterSubmit && props.afterSubmit(newCustomer)
    }

    return (
        <FormSection
            header={customerFields.name ?? "-"}
            errorMessage={errorMessage}
        >
            <>
                <CustomerForm
                    {...props}
                    onSubmit={onSubmit}
                    customerFields={customerFields}
                    setCustomerFields={setCustomerFields}
                    setErrorMessage={setErrorMessage}
                />
                {errorMessage && (
                    <>
                        <ErrorAlert />
                        <Box>{errorMessage}</Box>
                    </>
                )}
            </>
        </FormSection>
    )
}

export const EditCustomerForm = (props: EditCustomerFormProps): JSX.Element => {
    const { user } = useContext(UserContext)
    const { put } = useUpdateCustomers(user)

    const { customer } = props

    const [customerFields, setCustomerFields] = useState<CustomerFields>(
        customer || {}
    )

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (cust: Customer) => {
        const updatedCustomer = await put(cust, errorHandler)
        return props.afterSubmit && props.afterSubmit(updatedCustomer)
    }

    return (
        <FormSection
            header={customerFields.name ?? "-"}
            errorMessage={errorMessage}
        >
            <>
                <CustomerForm
                    {...props}
                    onSubmit={onSubmit}
                    customerFields={customerFields}
                    setCustomerFields={setCustomerFields}
                    setErrorMessage={setErrorMessage}
                />
            </>
        </FormSection>
    )
}

export const AddCustomerForm = (
    props: CreateCustomerFormProps
): JSX.Element => {
    const { user } = useContext(UserContext)
    const { post } = useUpdateCustomers(user)

    const { customer } = props

    const [customerFields, setCustomerFields] = useState<CustomerFields>(
        customer || {}
    )

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (cust: Customer) => {
        const newCustomer = await post(cust, errorHandler)
        return props.afterSubmit && props.afterSubmit(newCustomer)
    }

    return (
        <>
            <CustomerForm
                {...props}
                onSubmit={onSubmit}
                customerFields={customerFields}
                setCustomerFields={setCustomerFields}
                setErrorMessage={setErrorMessage}
            />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}

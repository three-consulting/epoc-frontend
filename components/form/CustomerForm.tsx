import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Box,
    Flex,
} from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { Customer } from "@/lib/types/apiTypes"
import { useUpdateCustomers } from "@/lib/hooks/useUpdate"
import { FormBase } from "@/lib/types/forms"
import ErrorAlert from "../common/ErrorAlert"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { customerFieldMetadata } from "@/lib/types/typeMetadata"

type CreateCustomerFormProps = FormBase<Customer>

type EditCustomerFormProps = CreateCustomerFormProps & {
    customer: Customer
}

type CustomerFormProps = CreateCustomerFormProps & {
    customer?: Customer
    onSubmit: (customer: Customer) => void
}

type CustomerFields = Partial<Customer>

const validateCustomerFields = (fields: CustomerFields): Customer => {
    const { name } = fields
    if (name) {
        return { ...fields, name }
    }
    throw Error("Invalid customer form: missing required fields")
}

function CustomerForm({
    onSubmit,
    onCancel,
    customer: customerOrNull,
}: CustomerFormProps) {
    const [customerFields, setCustomerFields] = useState<CustomerFields>(
        customerOrNull || {}
    )

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

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
                        const customer = validateCustomerFields(customerFields)
                        onSubmit(customer)
                    } catch (error) {
                        errorHandler(error as Error)
                    }
                }}
            >
                <div style={{ padding: "20px" }}>
                    <FormControl
                        isRequired={customerFieldMetadata.name.required}
                    >
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
                </div>
                <div style={{ textAlign: "right", padding: "20px" }}>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        type="submit"
                        data-testid="form-button-submit"
                    >
                        Save
                    </Button>
                    <Button
                        colorScheme="grey"
                        variant="outline"
                        onClick={abortSubmission}
                        data-testid="form-button-cancel"
                    >
                        Cancel
                    </Button>
                </div>
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

export const CreateCustomerForm = (
    props: CreateCustomerFormProps
): JSX.Element => {
    const { user } = useContext(UserContext)
    const { post } = useUpdateCustomers(user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (customer: Customer) => {
        const newCustomer = await post(customer, errorHandler)
        return props.afterSubmit && props.afterSubmit(newCustomer)
    }

    return (
        <>
            <CustomerForm {...props} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}

export const EditCustomerForm = (props: EditCustomerFormProps): JSX.Element => {
    const { user } = useContext(UserContext)
    const { put } = useUpdateCustomers(user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (customer: Customer) => {
        const updatedCustomer = await put(customer, errorHandler)
        return props.afterSubmit && props.afterSubmit(updatedCustomer)
    }

    return (
        <>
            <CustomerForm {...props} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}

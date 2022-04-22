import { FormControl, FormLabel, Input, Button, Box } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { Customer } from "@/lib/types/apiTypes"
import { useUpdateCustomers } from "@/lib/hooks/useCustomers"
import { FormBase } from "@/lib/types/forms"
import ErrorAlert from "../common/ErrorAlert"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"

type CreateCustomerFormProps = FormBase<Customer>

type CustomerFields = Partial<Customer>

const validateCustomerFields = (fields: CustomerFields): Customer => {
    const { name } = fields
    if (name) {
        return { ...fields, name }
    }
    throw Error("Invalid customer form: missing required fields")
}

export function CreateCustomerForm({
    afterSubmit,
    onCancel,
}: CreateCustomerFormProps): JSX.Element {
    const [customerFields, setCustomerFields] = useState<CustomerFields>({})
    const { user } = useContext(UserContext)
    const { postCustomer } = useUpdateCustomers(user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async () => {
        try {
            const customer = validateCustomerFields(customerFields)
            const createCustomerRequest = await postCustomer(
                customer,
                errorHandler
            )
            return afterSubmit && afterSubmit(createCustomerRequest)
        } catch (error) {
            errorHandler(error as Error)
            return null
        }
    }

    return (
        <>
            <div style={{ padding: "20px" }}>
                <FormControl>
                    <FormLabel>Customer Name</FormLabel>
                    <Input
                        placeholder="Customer Name"
                        onChange={(event) =>
                            setCustomerFields({
                                ...customerFields,
                                name: event.target.value,
                            })
                        }
                        data-testid={"form-field-name"}
                    />
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Description</FormLabel>
                    <Input
                        placeholder="Description"
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
                    onClick={onSubmit}
                    data-testid="form-button-submit"
                >
                    Save
                </Button>
                <Button
                    colorScheme="grey"
                    variant="outline"
                    onClick={onCancel}
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
        </>
    )
}

export default CreateCustomerFormProps

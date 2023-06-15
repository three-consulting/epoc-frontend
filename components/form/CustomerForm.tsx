import React from "react"
import { useForm } from "react-hook-form"
import { Checkbox, FormLabel, Input } from "@chakra-ui/react"
import { Customer } from "@/lib/types/apiTypes"
import _ from "lodash"
import { FormContainer, FormField, SubmitButton, toggleArchived } from "./utils"

type CustomerFormProps = {
    customer: Partial<Customer>
    onSubmit: (customer: Customer) => Promise<void>
}

const convertCustomer = ({ name, ...rest }: Partial<Customer>): Customer => {
    if (name) {
        return { ...rest, name }
    }
    throw Error("Form error, missing required fields")
}

const CustomerForm = ({ customer, onSubmit }: CustomerFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onBlur" })

    return (
        <FormContainer>
            <form
                onSubmit={handleSubmit((data) =>
                    onSubmit(convertCustomer({ ...customer, ...data }))
                )}
            >
                <FormField field={"name"} errors={errors}>
                    <FormLabel>Name</FormLabel>
                    <Input
                        {...register("name", {
                            required: "This is required",
                        })}
                        defaultValue={customer.name}
                    />
                </FormField>
                <FormField field={"description"} errors={errors}>
                    <FormLabel>Description</FormLabel>
                    <Input
                        {...register("description")}
                        defaultValue={customer.description}
                    />
                </FormField>
                <FormField field={"archived"} errors={errors}>
                    <FormLabel>Archived</FormLabel>
                    <Checkbox
                        onChange={(event) =>
                            toggleArchived(event.target.checked, setValue)
                        }
                        defaultChecked={customer.status === "ARCHIVED"}
                    />
                </FormField>
                <SubmitButton disabled={!_.isEmpty(errors)} />
            </form>
        </FormContainer>
    )
}

export default CustomerForm

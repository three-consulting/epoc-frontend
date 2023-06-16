import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Checkbox, FormLabel, Input, useToast } from "@chakra-ui/react"
import { Customer } from "@/lib/types/apiTypes"
import _ from "lodash"
import { FormContainer, FormField, SubmitButton, toggleArchived } from "./utils"
import { ApiUpdateResponse } from "@/lib/types/hooks"

type CustomerFormProps = {
    customer: Partial<Customer>
    onSubmit: (customer: Customer) => Promise<ApiUpdateResponse<Customer>>
}

const convertCustomer = ({ name, ...rest }: Partial<Customer>): Customer => {
    if (!_.isUndefined(name)) {
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

    const toast = useToast()

    const successToast = () =>
        toast({
            title: "Customer saved.",
            status: "success",
            duration: 4000,
            isClosable: true,
        })

    const errorToast = () =>
        toast({
            title: "Error saving customer.",
            status: "error",
            duration: 4000,
            isClosable: true,
        })

    const submit = handleSubmit(async (data) => {
        setIsLoading(true)
        const { isSuccess } = await onSubmit(
            convertCustomer({ ...customer, ...data })
        )
        setIsLoading(false)
        if (isSuccess) {
            successToast()
        } else {
            errorToast()
        }
    })

    const [isLoading, setIsLoading] = useState(false)

    return (
        <FormContainer>
            <form onSubmit={submit}>
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
                <SubmitButton
                    disabled={!_.isEmpty(errors)}
                    isLoading={isLoading}
                />
            </form>
        </FormContainer>
    )
}

export default CustomerForm
